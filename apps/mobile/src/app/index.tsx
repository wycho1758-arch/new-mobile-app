import { useEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ParticipantNotification, PaymentRecord, SupportCenterResponse, TournamentDivision } from '@template/contracts';
import {
  type MockTournamentApplication,
  type MockTournament,
  type ParticipantProfile,
  REQUIRED_DUPR_ERROR,
  hasRequiredDupr,
  sandboxParticipantSession,
  saveSandboxDupr,
  describeApplicationPolicy,
  describeSupportRefundPolicyCopy,
  submitSandboxTournamentApplication,
} from '../participant/mock-session';
import { createParticipantApiClient, getParticipantApiConfigFromPublicEnv, type ParticipantApiClient } from '../participant/api-client';

const palette = {
  brand: '#558d60',
  word: '#549a3d',
  orange: '#ef8b2c',
  yellowPaddle: '#f4bf35',
  ink: '#1f2937',
  muted: '#6b7280',
  bg: '#f7faf8',
  surface: '#ffffff',
  mint: '#e9f1ea',
  line: '#e5e7eb',
  kakao: '#fee500',
  kakaoInk: '#2b1c15',
  live: '#F43F5E',
  success: '#2f7d4b',
  softGreen: '#eaf6d7',
  warning: '#b45309',
};

const defaultParticipantApi = createParticipantApiClient(getParticipantApiConfigFromPublicEnv());
const defaultTournamentId = sandboxParticipantSession.featuredTournament.tournamentId;

type ParticipantStoreState = {
  socialSessionStarted: boolean;
  profile: ParticipantProfile;
  duprInput: string;
  application: MockTournamentApplication | null;
  featuredTournament: MockTournament;
  tournamentDivisions: TournamentDivision[];
  supportCenter: SupportCenterResponse;
  notifications: ParticipantNotification[];
  paymentRecords: PaymentRecord[];
  apiMode: 'mock' | 'api' | 'fallback';
};

const fallbackSupportCenter: SupportCenterResponse = {
  policyCopy: describeSupportRefundPolicyCopy({ refundPolicy: 'participantSelfCancelDisabled', supportChannel: 'oneToOneInquiry' }),
  contactEmail: 'support@happickle.kr',
  operatingHours: '평일 10:00 ~ 18:00 (주말·공휴일 휴무)',
  inquiries: [{ inquiryId: 'inquiry_local_refund', participantId: sandboxParticipantSession.profile.participantId, channel: 'oneToOneInquiry', category: 'refund', subject: '환불/취소는 1:1 문의로 접수', status: 'operatorReview', createdAt: '2026-07-13T09:00:00.000Z' }],
};

const fallbackNotifications: ParticipantNotification[] = [
  { notificationId: 'notification_local_deadline', participantId: sandboxParticipantSession.profile.participantId, type: 'tournamentDeadline', title: '대회 마감 임박!', body: '오늘까지 신청하세요', createdAt: '2026-07-13T09:00:00.000Z' },
];

const initialParticipantState = (participantApi: ParticipantApiClient): ParticipantStoreState => ({
  socialSessionStarted: false,
  profile: sandboxParticipantSession.profile,
  duprInput: sandboxParticipantSession.profile.duprId ?? '',
  application: null,
  featuredTournament: sandboxParticipantSession.featuredTournament,
  tournamentDivisions: [],
  supportCenter: fallbackSupportCenter,
  notifications: fallbackNotifications,
  paymentRecords: [],
  apiMode: participantApi.enabled ? 'api' : 'mock',
});

let participantApi = defaultParticipantApi;
let participantState = initialParticipantState(participantApi);
const participantListeners = new Set<() => void>();

function emitParticipantState() {
  for (const listener of participantListeners) listener();
}

function setParticipantState(nextState: ParticipantStoreState) {
  participantState = nextState;
  emitParticipantState();
}

function patchParticipantState(patch: Partial<ParticipantStoreState>) {
  setParticipantState({ ...participantState, ...patch });
}

function subscribeParticipantState(listener: () => void) {
  participantListeners.add(listener);
  return () => participantListeners.delete(listener);
}

function getParticipantSnapshot() {
  return participantState;
}

export function resetParticipantFlow(participantApiClient?: ParticipantApiClient) {
  participantApi = participantApiClient ?? defaultParticipantApi;
  participantState = initialParticipantState(participantApi);
  emitParticipantState();
}

function useParticipantFlow() {
  const state = useSyncExternalStore(subscribeParticipantState, getParticipantSnapshot, getParticipantSnapshot);
  const profileReady = state.socialSessionStarted && hasRequiredDupr(state.profile);
  const applicationPolicy = {
    refundPolicy: state.application?.refundPolicy ?? 'participantSelfCancelDisabled',
    supportChannel: state.application?.supportChannel ?? state.profile.supportChannel,
  } satisfies Pick<MockTournamentApplication, 'refundPolicy' | 'supportChannel'>;

  return useMemo(() => ({
    ...state,
    profileReady,
    applicationPolicy,
    policyCopy: describeApplicationPolicy(applicationPolicy),
    supportRefundPolicyCopy: state.supportCenter.policyCopy || describeSupportRefundPolicyCopy(applicationPolicy),
  }), [applicationPolicy, profileReady, state]);
}

export function startParticipantSession() {
  patchParticipantState({ socialSessionStarted: true });
  if (!participantApi.enabled) return;

  Promise.all([participantApi.getTournaments(), participantApi.getParticipantProfile()])
    .then(([tournaments, apiProfile]) => {
      patchParticipantState({
        featuredTournament: tournaments[0] ?? sandboxParticipantSession.featuredTournament,
        profile: apiProfile,
        duprInput: apiProfile.duprId ?? '',
        apiMode: 'api',
      });
    })
    .catch(() => patchParticipantState({ apiMode: 'fallback' }));

  Promise.all([participantApi.getSupportCenter(), participantApi.getNotifications(), participantApi.getMyPage()])
    .then(([supportCenter, notificationResponse, myPage]) => patchParticipantState({
      supportCenter,
      notifications: notificationResponse.notifications,
      application: myPage.applications[0] ?? null,
      paymentRecords: myPage.paymentRecords,
      apiMode: 'api',
    }))
    .catch(() => undefined);
}

function loadTournament(tournamentId: string) {
  if (!participantApi.enabled || !tournamentId) return;
  participantApi.getTournament(tournamentId)
    .then((tournament) => patchParticipantState({ featuredTournament: tournament, tournamentDivisions: tournament.divisions, apiMode: 'api' }))
    .catch(() => patchParticipantState({ apiMode: 'fallback' }));
}

function saveDupr() {
  const fallbackProfile = saveSandboxDupr(participantState.profile, participantState.duprInput);
  patchParticipantState({ profile: fallbackProfile, application: null });

  if (!participantApi.enabled) return;
  participantApi.updateParticipantProfile({ duprId: participantState.duprInput })
    .then((apiProfile) => {
      patchParticipantState({ profile: apiProfile, duprInput: apiProfile.duprId ?? '', apiMode: 'api' });
    })
    .catch(() => patchParticipantState({ apiMode: 'fallback' }));
}

export function saveParticipantDupr(duprId: string) {
  setParticipantState({ ...participantState, duprInput: duprId });
  saveDupr();
}

function submitApplication() {
  const fallbackApplication = submitSandboxTournamentApplication({
    profile: participantState.profile,
    tournament: participantState.featuredTournament,
  });
  patchParticipantState({ application: fallbackApplication });

  if (!participantApi.enabled) return;
  participantApi.createTournamentApplication({
    tournamentId: participantState.featuredTournament.tournamentId,
    participantId: participantState.profile.participantId,
    duprId: participantState.profile.duprId,
  })
    .then((createdApplication) => participantApi.getTournamentApplication(createdApplication.applicationId))
    .then((apiApplication) => patchParticipantState({ application: apiApplication, apiMode: 'api' }))
    .catch(() => patchParticipantState({ apiMode: 'fallback' }));
}

function setDuprInput(duprInput: string) {
  patchParticipantState({ duprInput });
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <View accessibilityLabel="Happickle" testID={small ? 'header-logo' : 'login-logo'} style={[styles.logoRow, small && styles.logoRowSmall]}>
      <Text style={[styles.logoWord, small && styles.logoWordSmall]}>Ha</Text>
      <View style={[styles.paddle, styles.paddleOrange, small && styles.paddleSmall]} />
      <View style={[styles.paddle, styles.paddleYellow, small && styles.paddleSmall]} />
      <Text style={[styles.logoWord, small && styles.logoWordSmall]}>ickle</Text>
    </View>
  );
}

function ActionButton({ testID, label, onPress, secondary = false, disabled = false }: { testID: string; label: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable testID={testID} accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={[secondary ? styles.secondaryAction : styles.primaryAction, disabled && styles.disabledAction]}><Text style={secondary ? styles.secondaryActionText : styles.primaryActionText}>{label}</Text></Pressable>;
}

function Row({ left, right }: { left: string; right?: string }) {
  return <View style={styles.infoRow}><Text style={styles.bodyCopy}>{left}</Text>{right ? <Text style={styles.rowRight}>{right}</Text> : null}</View>;
}

function participantApiModeLabel(apiMode: ParticipantStoreState['apiMode']) {
  if (apiMode === 'api') return 'API 연결됨';
  if (apiMode === 'fallback') return 'API 폴백 모드';
  return '샌드박스 모드';
}

function applicationSubmittedLabel(apiMode: ParticipantStoreState['apiMode']) {
  if (apiMode === 'api') return 'API 신청 접수됨';
  if (apiMode === 'fallback') return '폴백 신청 접수됨';
  return '샌드박스 신청 접수됨';
}

const bottomTabs = [
  { label: '탐색', route: '/tournaments', testID: 'bottom-tab-explore', active: 'tournaments' },
  { label: '내 경기', route: '/games', testID: 'bottom-tab-games', active: 'games' },
  { label: '알림', route: '/notifications', testID: 'bottom-tab-notifications', active: 'notifications' },
  { label: '마이', route: '/mypage', testID: 'bottom-tab-mypage', active: 'mypage' },
] as const;

function BottomNav({ active }: { active: string }) {
  return (
    <View style={styles.bottomNav}>{bottomTabs.map((tab) => (
      <Pressable key={tab.label} testID={tab.testID} accessibilityRole="button" onPress={() => router.push(tab.route)} style={[styles.navButton, active === tab.active && styles.navButtonActive]}>
        <Text style={[styles.bottomNavItem, active === tab.active && styles.bottomNavItemActive]}>{tab.label}</Text>
      </Pressable>
    ))}</View>
  );
}

function LoginScreen({ participantApiClient }: { participantApiClient?: ParticipantApiClient }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    resetParticipantFlow(participantApiClient);
    initialized.current = true;
  }

  const start = () => {
    startParticipantSession();
    router.push('/tournaments');
  };

  return (
    <View style={styles.loginScreen}><View testID="login-artboard" style={styles.phoneFrame}><View style={styles.loginMain}>
      <Logo /><Text testID="login-logo-text" style={styles.hiddenParityText}>Happickle</Text>
      <Text testID="login-subtitle" style={styles.tagline}>대한피클볼협회 공식 대회 플랫폼</Text>
      <View testID="login-illustration" style={styles.illWrap}><Text style={styles.illIcon}>◌</Text><Text style={styles.illHandle}>╲</Text></View>
      <Pressable testID="kakao-login-button" accessibilityRole="button" onPress={start} style={[styles.btn, styles.kakaoButton]}><Text style={styles.kakaoButtonText}>카카오로 계속하기</Text></Pressable>
      <Pressable testID="apple-login-button" accessibilityRole="button" onPress={start} style={[styles.btn, styles.appleButton]}><Text style={styles.appleButtonText}>Apple로 계속하기</Text></Pressable>
      <Text testID="login-consent-copy" style={styles.hint}>처음이시면 자동으로 회원가입이 진행돼요</Text>
    </View></View></View>
  );
}

function ParticipantRouteScaffold({ active, children }: { active: string; children: ReactNode }) {
  const { socialSessionStarted } = useParticipantFlow();
  if (!socialSessionStarted) return <LoginScreen />;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.header}><View><Logo small /><Text style={styles.headerSubtitle}>대한피클볼협회 공식</Text></View><Text testID="session-actor" style={styles.sessionText}>{sandboxParticipantSession.sessionActor.actorId}</Text></View>
      {children}
      <View testID="deferred-reference-screens" style={styles.sectionCard}><Text style={styles.sectionLabel}>시각 참고 / MVP 지연</Text><Text style={styles.caption}>결제 · 환불 · 대진표 · 점수 입력 · 결과 확정 · 회원탈퇴는 이번 로컬 MVP에서 실제 처리하지 않습니다.</Text></View>
      <BottomNav active={active} />
    </ScrollView>
  );
}

export type HomeProps = {
  participantApiClient?: ParticipantApiClient;
};

export default function Home({ participantApiClient }: HomeProps = {}) {
  return <LoginScreen participantApiClient={participantApiClient} />;
}

export function TournamentsScreen() {
  const { featuredTournament, apiMode } = useParticipantFlow();
  const tournamentPath = `/tournaments/${featuredTournament.tournamentId}`;

  return (
    <ParticipantRouteScaffold active="tournaments">
      <View testID="explore-home" style={styles.heroCard}>
        <Text style={styles.heroTitle}>어떤 대회에 나가볼까요?</Text><View style={styles.searchBox}><Text style={styles.searchText}>대회명으로 검색</Text></View>
        <View style={styles.filterRow}>{['서울특별시', '최신순', '접수중', '접수마감', '종료'].map((chip) => <Text key={chip} style={[styles.filterChip, chip === '접수중' && styles.activeChip]}>{chip}</Text>)}</View>
        <View style={styles.cardTopRow}><Text style={styles.sectionTitleSmall}>접수 중인 대회</Text><Text testID="participant-api-mode" style={styles.countText}>{participantApiModeLabel(apiMode)}</Text></View>
      </View>
      <Pressable testID="mock-tournament-card" accessibilityRole="button" onPress={() => router.push(tournamentPath)} style={styles.tournamentCard}>
        <View style={styles.cardTopRow}><View style={styles.badgeRow}><Text style={styles.badge}>접수중</Text><Text style={styles.dDay}>D-5</Text></View><Text style={styles.countText}>신청 48 / 64</Text></View>
        <Text style={styles.cardTitle}>{featuredTournament.title}</Text><Text style={styles.bodyCopy}>8월 9일 (토) · 오전 9:00</Text><Text style={styles.bodyCopy}>올림픽공원 SK핸드볼경기장</Text>
        <View style={styles.divisionRow}>{['남자복식', '혼합복식', '+2'].map((x) => <Text key={x} style={styles.divisionChip}>{x}</Text>)}</View><Text style={styles.caption}>참가비</Text><Text style={styles.priceText}>30,000원</Text>
        <View style={styles.secondaryTournament}><Text style={styles.liveBadge}>경기중</Text><Text style={styles.bodyCopy}>제2회 한강 오픈 챌린지</Text><Text style={styles.caption}>8월 2일 (토) · 진행 중</Text></View>
      </Pressable>
      <View testID="quick-actions" style={styles.sectionCard}><Text style={styles.sectionTitle}>빠른 이동</Text><ActionButton testID="go-support-button" label="1:1 문의 보기" secondary onPress={() => router.push('/support')} /><ActionButton testID="go-dupr-button" label="DUPR 등록하기" secondary onPress={() => router.push('/dupr-profile')} /></View>
    </ParticipantRouteScaffold>
  );
}

export function TournamentDetailScreen({ tournamentId = defaultTournamentId }: { tournamentId?: string }) {
  const { featuredTournament, tournamentDivisions, profileReady, policyCopy } = useParticipantFlow();
  useEffect(() => loadTournament(tournamentId), [tournamentId]);
  const applyRoute = `/tournaments/${featuredTournament.tournamentId}/apply`;

  return (
    <ParticipantRouteScaffold active="tournaments">
      <View testID="tournament-detail" style={styles.sectionCard}>
        <View style={styles.badgeRow}><Text style={styles.badge}>접수중</Text><Text style={styles.dDay}>D-5</Text></View><Text style={styles.sectionTitle}>{featuredTournament.title}</Text><Text style={styles.bodyCopy}>주최 · 대한피클볼협회</Text>
        <Row left="일정" right="8월 9일 (토) · 오전 9:00" /><Row left="장소" right="올림픽공원 SK핸드볼경기장" /><Text style={styles.linkText}>지도보기</Text><Row left="참가비" right="단식 30,000원 · 복식(대표결제) 60,000원" />
        <Text style={styles.sectionLabel}>종목 선택</Text>{(tournamentDivisions.length ? tournamentDivisions : [{ divisionId: 'local-mens', name: '남자복식', skillLevel: 'DUPR 3.5~4.5', entryFeeKrw: 60000, capacityTeams: 64 }]).map((division) => <View key={division.divisionId} style={styles.choiceCard}><Text style={styles.choiceTitle}>{division.name}</Text><Text style={styles.bodyCopy}>{division.skillLevel ?? 'DUPR 제한없음'} · 마감 8/7</Text><Text style={styles.caption}>정원 {division.capacityTeams ?? 32}팀</Text><Text style={styles.priceText}>{division.entryFeeKrw.toLocaleString('ko-KR')}원</Text></View>)}
        <Text style={styles.sectionLabel}>대회요강</Text><Text style={styles.caption}>· 경기방식: 예선 라운드로빈 후 본선 토너먼트{`\n`}· 공인구: OPTIC 피클볼 공인구 사용{`\n`}· 복장: 무지 상의 권장, 실내용 러버솔 착용 필수{`\n`}· 우천/불가항력 시 일정은 주최측 공지에 따름</Text>
        <Text style={styles.sectionLabel}>환불 규정</Text><Text style={styles.caption}>대회 3일 전까지 100% 환불 · 3일 이내 환불 불가 · 주최 측 취소 시 전액 환불됩니다. MVP에서는 실제 환불/취소 처리 없이 참고만 표시합니다. {policyCopy}</Text>
        <ActionButton testID="detail-apply-button" label="참가 신청으로 이동" onPress={() => router.push(profileReady ? applyRoute : '/dupr-profile')} />
      </View>
    </ParticipantRouteScaffold>
  );
}

export function DuprProfileScreen() {
  const { profile, duprInput, profileReady, featuredTournament } = useParticipantFlow();

  return (
    <ParticipantRouteScaffold active="mypage">
      <View testID="dupr-management" style={styles.duprCard}><Text style={styles.sectionLabel}>DUPR 정보 관리</Text><Text testID="dupr-gate-status" style={styles.sectionTitle}>{profileReady ? '현재 DUPR 저장됨' : '참가 신청 전 DUPR 정보가 필요해요'}</Text><Text style={styles.bigDupr}>{hasRequiredDupr(profile) ? profile.duprId : '4.2'}</Text><Text style={styles.statusStrong}>관리자 확인중</Text><Text style={styles.bodyCopy}>DUPR 프로필 스크린샷 첨부 · 확인이 빨라져요 (JPG, PNG)</Text><Text style={styles.caption}>DUPR 값은 자기신고 기준이며 대회 참가 시 참고용으로만 표시됩니다</Text><TextInput testID="dupr-input" accessibilityLabel="DUPR ID" onChangeText={setDuprInput} placeholder="DUPR ID 또는 프로필 링크" placeholderTextColor={palette.muted} value={duprInput} style={styles.input} /><ActionButton testID="save-dupr-button" label="저장하기" secondary onPress={saveDupr} />{hasRequiredDupr(profile) ? <Text testID="saved-dupr" style={styles.statusStrong}>현재 DUPR {profile.duprId} · 관리자 확인중</Text> : null}<ActionButton testID="dupr-continue-application" label="참가 신청 계속" onPress={() => router.push(`/tournaments/${featuredTournament.tournamentId}/apply`)} disabled={!hasRequiredDupr(profile)} /></View>
    </ParticipantRouteScaffold>
  );
}

export function TournamentApplicationScreen({ tournamentId = defaultTournamentId }: { tournamentId?: string }) {
  const { profile, profileReady, application, featuredTournament, apiMode } = useParticipantFlow();
  useEffect(() => loadTournament(tournamentId), [tournamentId]);

  return (
    <ParticipantRouteScaffold active="tournaments">
      <View testID="application-form" style={styles.sectionCard}><Text style={styles.sectionLabel}>참가 신청</Text><Text style={styles.sectionTitle}>{featuredTournament.title}</Text><Text style={styles.priceText}>남자복식 · 2인 대표결제{`\n`}60,000원</Text><Text style={styles.sectionLabel}>참가자 정보</Text><View style={styles.choiceCard}><Text style={styles.choiceTitle}>{profile.displayName}</Text><Text style={styles.bodyCopy}>{hasRequiredDupr(profile) ? `DUPR ${profile.duprId}` : 'DUPR 미등록'} · 010-••••-5678</Text><Text style={styles.badge}>대표자</Text></View><Text style={styles.sectionLabel}>복식 파트너 초대</Text><View style={styles.choiceCard}><Text style={styles.bodyCopy}>파트너 전화번호를 입력해 초대하세요</Text><Text style={styles.linkText}>초대하기</Text><Text style={styles.badge}>대기중</Text><Text style={styles.caption}>유효기간 72시간 · 42:18:05 남음 · 링크 재발송</Text></View><Text style={styles.sectionLabel}>약관 동의</Text><Text style={styles.caption}>[필수] 개인정보 수집·이용에 동의합니다{`\n`}[필수] 환불 규정을 확인하였습니다{`\n`}신청 후 참가자 직접 취소와 환불은 MVP에서 제공하지 않으며 1:1 문의로 운영자가 안내합니다.</Text>{!profileReady ? <Text testID="application-blocker" style={styles.blockerText}>{REQUIRED_DUPR_ERROR}: DUPR 정보를 저장한 뒤 참가 신청을 진행할 수 있어요.</Text> : null}<Pressable testID="application-cta" accessibilityRole="button" accessibilityState={{ disabled: !profileReady }} disabled={!profileReady} onPress={submitApplication} style={[styles.primaryAction, !profileReady && styles.disabledAction]}><Text style={styles.primaryActionText}>{profileReady ? '참가 신청하기' : '파트너 수락 후 결제가능 · DUPR 필요'}</Text></Pressable>{application ? <Text testID="application-submitted" style={styles.statusStrong}>{applicationSubmittedLabel(apiMode)}: {application.applicationId} · {describeApplicationPolicy(application)}</Text> : null}</View>
    </ParticipantRouteScaffold>
  );
}

export function SupportScreen() {
  const { supportRefundPolicyCopy, supportCenter } = useParticipantFlow();

  return (
    <ParticipantRouteScaffold active="mypage">
      <View testID="support-center" style={styles.supportCard}><Text style={styles.sectionLabel}>고객센터</Text><Text style={styles.sectionTitle}>자주 묻는 질문</Text><Text testID="support-copy" style={styles.bodyCopy}>{supportRefundPolicyCopy}</Text>{supportCenter.inquiries.map((inquiry) => <Text key={inquiry.inquiryId} style={styles.caption}>문의 상태: {inquiry.subject} · {inquiry.status}</Text>)}<View style={styles.actionRow}><Text style={styles.secondaryPill}>카카오톡 1:1 문의</Text><Text style={styles.secondaryPill}>이메일 1:1 문의</Text></View><Text style={styles.caption}>운영시간: {supportCenter.operatingHours}{`\n`}{supportCenter.contactEmail} (1:1 문의 접수용){`\n`}대한피클볼협회 운영</Text></View>
    </ParticipantRouteScaffold>
  );
}

export function GamesScreen() {
  return <ParticipantRouteScaffold active="games"><View testID="my-games-screen" style={styles.sectionCard}><Text style={styles.sectionLabel}>내 경기</Text><Text style={styles.sectionTitle}>다음 경기 · 코트 3</Text><Text style={styles.bodyCopy}>오후 2:30 시작 예정</Text><Text style={styles.bodyCopy}>김민준 · 이서연 VS 박지훈 · 정수빈</Text><Text style={styles.caption}>지난 경기 결과 · 점수 입력 · 확인 대기 · 확정은 MVP 참고 화면입니다.</Text></View></ParticipantRouteScaffold>;
}

export function NotificationsScreen() {
  const { notifications } = useParticipantFlow();
  return <ParticipantRouteScaffold active="notifications"><View testID="notifications-screen" style={styles.sectionCard}><Text style={styles.sectionLabel}>알림</Text>{notifications.map((notification) => <View key={notification.notificationId}><Text style={styles.sectionTitle}>{notification.title}</Text><Text style={styles.bodyCopy}>{notification.body}</Text></View>)}</View></ParticipantRouteScaffold>;
}

export function MyPageScreen() {
  const { profile, application, paymentRecords } = useParticipantFlow();
  const paymentCopy = paymentRecords[0] ? `${paymentRecords[0].status} · ${paymentRecords[0].amountKrw.toLocaleString('ko-KR')}원 · 오프라인 운영자 확인` : '결제 내역 없음 · 오프라인 결제는 운영자 확인 대기';
  return <ParticipantRouteScaffold active="mypage"><View testID="mypage-screen" style={styles.sectionCard}><Text style={styles.sectionLabel}>마이</Text><Text style={styles.sectionTitle}>{profile.displayName} · DUPR {hasRequiredDupr(profile) ? profile.duprId : '미등록'}</Text><Text style={styles.bodyCopy}>송파피클볼클럽</Text><Text testID="mypage-payment-status" style={styles.bodyCopy}>{paymentCopy}</Text>{application ? <Text style={styles.caption}>최근 신청: {application.applicationId}</Text> : null}<Text style={styles.caption}>프로필 수정 · 내 경기 기록 · 결제 내역 · DUPR 정보 관리 · 알림 설정 · 고객센터 · 로그아웃</Text><ActionButton testID="mypage-dupr-button" label="DUPR 정보 관리" secondary onPress={() => router.push('/dupr-profile')} /><ActionButton testID="mypage-support-button" label="고객센터" secondary onPress={() => router.push('/support')} /></View></ParticipantRouteScaffold>;
}

const fontSans = 'Noto Sans KR, Inter, SF Pro Display, system-ui, sans-serif';
const fontMono = 'JetBrains Mono, SF Mono, Menlo, monospace';

const styles = StyleSheet.create({
  loginScreen: { flex: 1, alignItems: 'center', backgroundColor: palette.bg, minHeight: 640 },
  phoneFrame: { alignItems: 'center', backgroundColor: palette.bg, maxWidth: 480, minHeight: 640, width: '100%' },
  loginMain: { alignItems: 'center', width: '100%' },
  logoRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 1, marginTop: 150 },
  logoRowSmall: { marginTop: 0 },
  logoWord: { color: palette.word, fontFamily: fontSans, fontSize: 33, fontWeight: '900', letterSpacing: -1.2, lineHeight: 38 },
  logoWordSmall: { fontSize: 24, lineHeight: 28 },
  paddle: { borderRadius: 999, height: 30, marginTop: 5, width: 16 },
  paddleSmall: { height: 22, width: 12, marginTop: 3 },
  paddleOrange: { backgroundColor: palette.orange },
  paddleYellow: { backgroundColor: palette.yellowPaddle },
  hiddenParityText: { height: 0, opacity: 0 },
  tagline: { color: palette.muted, fontFamily: fontSans, fontSize: 12, fontWeight: '500', marginTop: 5, textAlign: 'center' },
  illWrap: { alignItems: 'center', backgroundColor: palette.mint, borderRadius: 42, height: 84, justifyContent: 'center', marginTop: 30, width: 84 },
  illIcon: { color: palette.brand, fontSize: 38, fontWeight: '500', lineHeight: 40 },
  illHandle: { color: palette.brand, fontSize: 28, lineHeight: 28, marginTop: -16 },
  btn: { alignItems: 'center', borderRadius: 14, height: 52, justifyContent: 'center', maxWidth: 400, width: '83%' },
  kakaoButton: { backgroundColor: palette.kakao, marginTop: 56 },
  kakaoButtonText: { color: palette.kakaoInk, fontFamily: fontSans, fontSize: 15, fontWeight: '700' },
  appleButton: { backgroundColor: palette.ink, marginTop: 12 },
  appleButtonText: { color: '#ffffff', fontFamily: fontSans, fontSize: 15, fontWeight: '700' },
  hint: { color: palette.muted, fontFamily: fontSans, fontSize: 12, fontWeight: '500', marginBottom: 114, marginTop: 16, textAlign: 'center' },
  page: { flex: 1, backgroundColor: palette.bg },
  content: { alignSelf: 'center', gap: 16, maxWidth: 760, padding: 18, paddingBottom: 84, width: '100%' },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  headerSubtitle: { color: palette.muted, fontFamily: fontSans, fontSize: 12, fontWeight: '700' },
  sessionText: { color: palette.muted, fontFamily: fontMono, fontSize: 10, maxWidth: 150 },
  heroCard: { backgroundColor: palette.surface, borderRadius: 28, gap: 14, padding: 20 },
  heroTitle: { color: palette.ink, fontFamily: fontSans, fontSize: 28, fontWeight: '900', lineHeight: 34 },
  searchBox: { backgroundColor: '#f1f5f1', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 13 },
  searchText: { color: palette.muted, fontFamily: fontSans, fontSize: 15 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { backgroundColor: '#eef2ee', borderRadius: 999, color: palette.ink, fontFamily: fontSans, fontSize: 13, fontWeight: '700', paddingHorizontal: 12, paddingVertical: 7 },
  activeChip: { backgroundColor: palette.softGreen, color: palette.success },
  sectionTitleSmall: { color: palette.ink, fontFamily: fontSans, fontSize: 18, fontWeight: '900' },
  tournamentCard: { backgroundColor: palette.surface, borderColor: palette.line, borderRadius: 24, borderWidth: 1, gap: 8, padding: 18 },
  cardTopRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  badgeRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  badge: { alignSelf: 'flex-start', backgroundColor: palette.softGreen, borderRadius: 999, color: palette.success, fontFamily: fontSans, fontSize: 12, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 5 },
  dDay: { color: palette.success, fontFamily: fontSans, fontSize: 12, fontWeight: '900' },
  liveBadge: { alignSelf: 'flex-start', backgroundColor: '#ffe4e6', borderRadius: 999, color: palette.live, fontFamily: fontSans, fontSize: 12, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 5 },
  countText: { color: palette.muted, fontFamily: fontSans, fontSize: 12, fontWeight: '700' },
  cardTitle: { color: palette.ink, fontFamily: fontSans, fontSize: 22, fontWeight: '900', lineHeight: 28 },
  bodyCopy: { color: palette.ink, fontFamily: fontSans, fontSize: 15, lineHeight: 22 },
  divisionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  divisionChip: { backgroundColor: '#f3f4f6', borderRadius: 999, color: palette.ink, fontFamily: fontSans, fontSize: 12, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 5 },
  priceText: { color: palette.ink, fontFamily: fontSans, fontSize: 16, fontWeight: '900', lineHeight: 24 },
  secondaryTournament: { borderTopColor: palette.line, borderTopWidth: 1, gap: 4, marginTop: 8, paddingTop: 12 },
  sectionCard: { backgroundColor: palette.surface, borderColor: palette.line, borderRadius: 24, borderWidth: 1, gap: 12, padding: 18 },
  sectionLabel: { color: palette.success, fontFamily: fontSans, fontSize: 13, fontWeight: '900' },
  sectionTitle: { color: palette.ink, fontFamily: fontSans, fontSize: 22, fontWeight: '900', lineHeight: 28 },
  infoRow: { gap: 4 },
  rowRight: { color: palette.ink, fontFamily: fontSans, fontSize: 15, fontWeight: '800', lineHeight: 22 },
  choiceCard: { backgroundColor: '#f9fafb', borderRadius: 18, gap: 4, padding: 14 },
  choiceCardMuted: { backgroundColor: '#f3f4f6', borderRadius: 18, gap: 4, opacity: 0.72, padding: 14 },
  choiceTitle: { color: palette.ink, fontFamily: fontSans, fontSize: 17, fontWeight: '900' },
  caption: { color: palette.muted, fontFamily: fontSans, fontSize: 13, lineHeight: 19 },
  linkText: { color: palette.success, fontFamily: fontSans, fontSize: 14, fontWeight: '900' },
  duprCard: { backgroundColor: palette.mint, borderRadius: 24, gap: 12, padding: 18 },
  bigDupr: { color: palette.ink, fontFamily: fontSans, fontSize: 34, fontWeight: '900' },
  input: { backgroundColor: palette.surface, borderColor: palette.line, borderRadius: 14, borderWidth: 1, color: palette.ink, fontFamily: fontSans, fontSize: 16, paddingHorizontal: 14, paddingVertical: 12 },
  secondaryAction: { alignItems: 'center', backgroundColor: palette.surface, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 11 },
  secondaryActionText: { color: palette.ink, fontFamily: fontSans, fontSize: 15, fontWeight: '900' },
  statusStrong: { color: palette.success, fontFamily: fontSans, fontSize: 14, fontWeight: '900' },
  blockerText: { color: palette.warning, fontFamily: fontSans, fontSize: 14, fontWeight: '800', lineHeight: 20 },
  primaryAction: { alignItems: 'center', backgroundColor: palette.success, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 14 },
  disabledAction: { opacity: 0.55 },
  primaryActionText: { color: '#ffffff', fontFamily: fontSans, fontSize: 16, fontWeight: '900' },
  supportCard: { backgroundColor: '#eef2ff', borderRadius: 24, gap: 12, padding: 18 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  secondaryPill: { backgroundColor: palette.surface, borderRadius: 999, color: palette.ink, fontFamily: fontSans, fontSize: 13, fontWeight: '800', paddingHorizontal: 12, paddingVertical: 8 },
  bottomNav: { alignItems: 'center', backgroundColor: palette.surface, borderColor: palette.line, borderRadius: 24, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14 },
  navButton: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  navButtonActive: { backgroundColor: palette.softGreen },
  bottomNavItem: { color: palette.ink, fontFamily: fontSans, fontSize: 13, fontWeight: '800' },
  bottomNavItemActive: { color: palette.success },
});
