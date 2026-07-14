import { useEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ParticipantGame, ParticipantNotification, PaymentRecord, SupportCenterResponse, SupportInquiry, Tournament, TournamentDivision } from '@template/contracts';
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
  tournaments: Tournament[];
  tournamentDivisions: TournamentDivision[];
  supportCenter: SupportCenterResponse;
  notifications: ParticipantNotification[];
  paymentRecords: PaymentRecord[];
  participantGames: ParticipantGame[];
  apiMode: 'mock' | 'api' | 'fallback';
  routeStatus: Partial<Record<'support' | 'notifications' | 'mypage' | 'games' | 'tournamentDetail', 'loading' | 'ready' | 'fallback'>>;
  supportInquirySubmission: 'idle' | 'submitting' | 'submitted' | 'fallback';
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
  tournaments: [sandboxParticipantSession.featuredTournament],
  tournamentDivisions: [],
  supportCenter: fallbackSupportCenter,
  notifications: fallbackNotifications,
  paymentRecords: [],
  participantGames: [],
  apiMode: participantApi.enabled ? 'api' : 'mock',
  routeStatus: {},
  supportInquirySubmission: 'idle',
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

function patchRouteStatus(route: keyof ParticipantStoreState['routeStatus'], status: NonNullable<ParticipantStoreState['routeStatus'][keyof ParticipantStoreState['routeStatus']]>) {
  patchParticipantState({ routeStatus: { ...participantState.routeStatus, [route]: status } });
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
        tournaments: tournaments.length ? tournaments : [sandboxParticipantSession.featuredTournament],
        profile: apiProfile,
        duprInput: apiProfile.duprId ?? '',
        apiMode: 'api',
      });
    })
    .catch(() => patchParticipantState({ apiMode: 'fallback' }));

  hydrateParticipantUtilityPages();
}

function hydrateParticipantUtilityPages() {
  if (!participantApi.enabled) return;
  patchParticipantState({
    routeStatus: {
      ...participantState.routeStatus,
      support: 'loading',
      notifications: 'loading',
      mypage: 'loading',
      games: 'loading',
    },
  });

  Promise.allSettled([participantApi.getSupportCenter(), participantApi.getNotifications(), participantApi.getMyPage(), participantApi.getGames()])
    .then(([supportResult, notificationResult, myPageResult, gamesResult]) => {
      const patch: Partial<ParticipantStoreState> = { routeStatus: { ...participantState.routeStatus } };

      if (supportResult.status === 'fulfilled') {
        patch.supportCenter = supportResult.value;
        patch.routeStatus = { ...patch.routeStatus, support: 'ready' };
      } else {
        patch.routeStatus = { ...patch.routeStatus, support: 'fallback' };
      }

      if (notificationResult.status === 'fulfilled') {
        patch.notifications = notificationResult.value.notifications;
        patch.routeStatus = { ...patch.routeStatus, notifications: 'ready' };
      } else {
        patch.routeStatus = { ...patch.routeStatus, notifications: 'fallback' };
      }

      if (myPageResult.status === 'fulfilled') {
        patch.application = myPageResult.value.applications[0] ?? null;
        patch.paymentRecords = myPageResult.value.paymentRecords;
        patch.routeStatus = { ...patch.routeStatus, mypage: 'ready' };
      } else {
        patch.routeStatus = { ...patch.routeStatus, mypage: 'fallback' };
      }

      if (gamesResult.status === 'fulfilled') {
        patch.participantGames = gamesResult.value;
        patch.routeStatus = { ...patch.routeStatus, games: 'ready' };
      } else {
        patch.routeStatus = { ...patch.routeStatus, games: 'fallback' };
      }

      patch.apiMode = [supportResult, notificationResult, myPageResult, gamesResult].every((result) => result.status === 'fulfilled') ? 'api' : 'fallback';
      patchParticipantState(patch);
    });
}

function loadTournament(tournamentId: string) {
  if (!participantApi.enabled || !tournamentId) return;
  patchRouteStatus('tournamentDetail', 'loading');
  participantApi.getTournament(tournamentId)
    .then((tournament) => patchParticipantState({ featuredTournament: tournament, tournamentDivisions: tournament.divisions, apiMode: 'api', routeStatus: { ...participantState.routeStatus, tournamentDetail: 'ready' } }))
    .catch(() => patchParticipantState({ apiMode: 'fallback', routeStatus: { ...participantState.routeStatus, tournamentDetail: 'fallback' } }));
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

function getSelectedDivision() {
  return getAvailableDivisions(participantState.tournamentDivisions)[0];
}

function submitApplication() {
  const selectedDivision = getSelectedDivision();
  const fallbackApplication = submitSandboxTournamentApplication({
    profile: participantState.profile,
    tournament: participantState.featuredTournament,
    division: selectedDivision,
  });
  patchParticipantState({ application: fallbackApplication });

  if (!participantApi.enabled) return;
  participantApi.createTournamentApplication({
    tournamentId: participantState.featuredTournament.tournamentId,
    participantId: participantState.profile.participantId,
    duprId: participantState.profile.duprId,
    divisionId: selectedDivision?.divisionId,
  })
    .then((createdApplication) => participantApi.getTournamentApplication(createdApplication.applicationId))
    .then((apiApplication) => {
      patchParticipantState({ application: apiApplication, apiMode: 'api' });
      hydrateParticipantUtilityPages();
    })
    .catch(() => patchParticipantState({ apiMode: 'fallback' }));
}


const SUPPORT_INQUIRY_MVP_PAYLOAD = {
  category: 'refund',
  subject: 'MVP 환불/취소 1:1 문의',
} as const;

function createFallbackSupportInquiry(): SupportInquiry {
  return {
    inquiryId: `inquiry_local_${Date.now()}`,
    participantId: participantState.profile.participantId,
    applicationId: participantState.application?.applicationId,
    channel: 'oneToOneInquiry',
    category: SUPPORT_INQUIRY_MVP_PAYLOAD.category,
    subject: SUPPORT_INQUIRY_MVP_PAYLOAD.subject,
    status: 'operatorReview',
    createdAt: new Date().toISOString(),
  };
}

function submitSupportInquiry() {
  patchParticipantState({ supportInquirySubmission: 'submitting' });

  if (!participantApi.enabled) {
    patchParticipantState({
      supportInquirySubmission: 'submitted',
      supportCenter: { ...participantState.supportCenter, inquiries: [createFallbackSupportInquiry(), ...participantState.supportCenter.inquiries] },
    });
    return;
  }

  participantApi.createSupportInquiry({
    ...SUPPORT_INQUIRY_MVP_PAYLOAD,
    applicationId: participantState.application?.applicationId,
  })
    .then((inquiry) => patchParticipantState({
      supportInquirySubmission: 'submitted',
      supportCenter: { ...participantState.supportCenter, inquiries: [inquiry, ...participantState.supportCenter.inquiries] },
      apiMode: 'api',
      routeStatus: { ...participantState.routeStatus, support: 'ready' },
    }))
    .catch(() => patchParticipantState({
      supportInquirySubmission: 'fallback',
      apiMode: 'fallback',
      routeStatus: { ...participantState.routeStatus, support: 'fallback' },
    }));
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
  if (apiMode === 'api') return '최신 대회 정보';
  if (apiMode === 'fallback') return '일부 정보를 불러오지 못했습니다';
  return '대회 미리보기';
}

function routeStatusCopy(status?: NonNullable<ParticipantStoreState['routeStatus'][keyof ParticipantStoreState['routeStatus']]>) {
  if (status === 'loading') return 'API 데이터를 불러오는 중입니다.';
  if (status === 'fallback') return '일부 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.';
  if (status === 'ready') return undefined;
  return undefined;
}

function RouteStatusNotice({ status }: { status?: NonNullable<ParticipantStoreState['routeStatus'][keyof ParticipantStoreState['routeStatus']]> }) {
  const copy = routeStatusCopy(status);
  if (!copy) return null;
  return <Text testID="participant-route-state" style={status === 'fallback' ? styles.blockerText : styles.caption}>{copy}</Text>;
}

function applicationSubmittedLabel(apiMode: ParticipantStoreState['apiMode']) {
  if (apiMode === 'fallback') return '신청 접수 확인 중';
  return '참가 신청 접수 완료';
}

function formatTournamentDate(startsAt: string) {
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return startsAt;
  return new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short', hour: 'numeric', minute: '2-digit' }).format(date);
}

function tournamentDdayCopy(startsAt: string) {
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return '일정 확인';
  const days = Math.ceil((date.getTime() - Date.now()) / 86_400_000);
  return days > 0 ? `D-${days}` : '진행 예정';
}

const fallbackTournamentDivisions: TournamentDivision[] = [
  { divisionId: 'local-mixed', tournamentId: defaultTournamentId, name: '혼합복식', skillLevel: 'DUPR 3.5+', teamType: 'doubles', entryFeeKrw: 60000, capacityTeams: 32 },
  { divisionId: 'local-mens', tournamentId: defaultTournamentId, name: '남자복식', skillLevel: 'DUPR 3.5~4.5', teamType: 'doubles', entryFeeKrw: 60000, capacityTeams: 64 },
];

function getAvailableDivisions(tournamentDivisions: TournamentDivision[]) {
  return tournamentDivisions.length ? tournamentDivisions : fallbackTournamentDivisions;
}

function getApplicationDivisionName(application: MockTournamentApplication | null, divisions: TournamentDivision[], defaultDivision?: TournamentDivision) {
  const selectedDivision = application?.divisionId ? divisions.find((division) => division.divisionId === application.divisionId) : undefined;
  return selectedDivision?.name ?? defaultDivision?.name ?? '부문 확인 중';
}

function divisionTeamCopy(teamType: string) {
  return teamType === 'singles' ? '단식' : '복식';
}

function divisionFeeCopy(division: TournamentDivision) {
  return `${division.entryFeeKrw.toLocaleString('ko-KR')}원 · 운영자 확인 후 오프라인 결제 안내`;
}

function divisionEligibilityCopy(division: TournamentDivision) {
  return `${division.skillLevel ?? 'DUPR 제한없음'} · DUPR 등록 후 신청 가능`;
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
      <View testID="deferred-reference-screens" style={styles.sectionCard}><Text style={styles.sectionLabel}>시각 참고 / MVP 지연</Text><Text style={styles.caption}>결제 · 환불 · 대진표 · 점수 입력 · 결과 확정은 운영자 안내에 따라 순차적으로 제공됩니다.</Text></View>
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
  const { featuredTournament, tournaments, apiMode } = useParticipantFlow();
  const visibleTournaments = tournaments.length ? tournaments : [featuredTournament];

  return (
    <ParticipantRouteScaffold active="tournaments">
      <View testID="explore-home" style={styles.heroCard}>
        <Text style={styles.heroTitle}>어떤 대회에 나가볼까요?</Text><View style={styles.searchBox}><Text style={styles.searchText}>대회명으로 검색</Text></View>
        <View style={styles.filterRow}>{['서울특별시', '최신순', '접수중', '접수마감', '종료'].map((chip) => <Text key={chip} style={[styles.filterChip, chip === '접수중' && styles.activeChip]}>{chip}</Text>)}</View>
        <View style={styles.cardTopRow}><Text style={styles.sectionTitleSmall}>접수 중인 대회</Text><Text testID="participant-api-mode" style={styles.countText}>{participantApiModeLabel(apiMode)}</Text></View>
      </View>
      {visibleTournaments.map((tournament, index) => {
        const tournamentPath = `/tournaments/${tournament.tournamentId}`;
        return (
          <Pressable key={tournament.tournamentId} testID={index === 0 ? 'mock-tournament-card' : 'api-tournament-card'} accessibilityRole="button" onPress={() => router.push(tournamentPath)} style={styles.tournamentCard}>
            <View style={styles.cardTopRow}><View style={styles.badgeRow}><Text style={styles.badge}>접수중</Text><Text style={styles.dDay}>{tournamentDdayCopy(tournament.startsAt)}</Text></View><Text style={styles.countText}>상세 보기</Text></View>
            <Text style={styles.cardTitle}>{tournament.title}</Text><Text style={styles.bodyCopy}>{formatTournamentDate(tournament.startsAt)}</Text><Text style={styles.bodyCopy}>{tournament.location}</Text>
            <View style={styles.divisionRow}><Text style={styles.divisionChip}>{tournament.division}</Text><Text style={styles.divisionChip}>{tournament.requiresDupr ? 'DUPR 필수' : 'DUPR 선택'}</Text></View><Text style={styles.caption}>결제 방식</Text><Text style={styles.priceText}>{tournament.paymentMode === 'operatorManagedOffline' ? '운영자 오프라인 확인' : tournament.paymentMode}</Text>
          </Pressable>
        );
      })}
      <View testID="quick-actions" style={styles.sectionCard}><Text style={styles.sectionTitle}>빠른 이동</Text><ActionButton testID="go-support-button" label="1:1 문의 보기" secondary onPress={() => router.push('/support')} /><ActionButton testID="go-dupr-button" label="DUPR 등록하기" secondary onPress={() => router.push('/dupr-profile')} /></View>
    </ParticipantRouteScaffold>
  );
}


export function TournamentDetailScreen({ tournamentId = defaultTournamentId }: { tournamentId?: string }) {
  const { featuredTournament, tournamentDivisions, profileReady, policyCopy, routeStatus } = useParticipantFlow();
  useEffect(() => loadTournament(tournamentId), [tournamentId]);
  const applyRoute = `/tournaments/${featuredTournament.tournamentId}/apply`;
  const availableDivisions = getAvailableDivisions(tournamentDivisions);

  return (
    <ParticipantRouteScaffold active="tournaments">
      <View testID="tournament-detail" style={styles.sectionCard}>
        <RouteStatusNotice status={routeStatus.tournamentDetail} />
        <View style={styles.badgeRow}><Text style={styles.badge}>접수중</Text><Text style={styles.dDay}>{tournamentDdayCopy(featuredTournament.startsAt)}</Text></View><Text style={styles.sectionTitle}>{featuredTournament.title}</Text><Text style={styles.bodyCopy}>주최 · 대한피클볼협회</Text>
        <Row left="일정" right={formatTournamentDate(featuredTournament.startsAt)} /><Row left="장소" right={featuredTournament.location} /><Text style={styles.linkText}>지도보기</Text><Row left="신청 방식" right={`${featuredTournament.requiresDupr ? 'DUPR 등록 후 ' : ''}부문 확인 · 결제는 운영자 오프라인 안내`} />
        <Text style={styles.sectionLabel}>신청 가능한 부문</Text>{availableDivisions.map((division) => <View key={division.divisionId} testID="division-option" style={styles.choiceCard}><Text style={styles.choiceTitle}>{division.name} · {divisionTeamCopy(division.teamType)}</Text><Text style={styles.bodyCopy}>{divisionEligibilityCopy(division)} · 마감 8/7</Text><Text style={styles.caption}>정원 {division.capacityTeams ?? 32}팀 · 참가자 직접 취소/환불 비활성화</Text><Text style={styles.priceText}>{divisionFeeCopy(division)}</Text></View>)}
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
  const { profile, profileReady, application, featuredTournament, tournamentDivisions, apiMode } = useParticipantFlow();
  useEffect(() => loadTournament(tournamentId), [tournamentId]);
  const availableDivisions = getAvailableDivisions(tournamentDivisions);
  const selectedDivision = availableDivisions[0];
  const submittedDivisionName = getApplicationDivisionName(application, availableDivisions, selectedDivision);

  return (
    <ParticipantRouteScaffold active="tournaments">
      <View testID="application-form" style={styles.sectionCard}><Text style={styles.sectionLabel}>참가 신청</Text><Text style={styles.sectionTitle}>{featuredTournament.title}</Text><View testID="application-division-summary" style={styles.choiceCard}><Text style={styles.choiceTitle}>기본 선택 부문 · {selectedDivision.name}</Text><Text style={styles.bodyCopy}>{divisionEligibilityCopy(selectedDivision)}</Text><Text style={styles.priceText}>{divisionTeamCopy(selectedDivision.teamType)} · {divisionFeeCopy(selectedDivision)}</Text><Text style={styles.caption}>현재 첫 번째 신청 가능 부문을 기본값으로 보여주며, 운영자가 접수 후 확정 안내합니다.</Text></View><Text style={styles.sectionLabel}>다른 신청 가능 부문</Text>{availableDivisions.map((division) => <Text key={division.divisionId} style={styles.caption}>· {division.name}: {divisionEligibilityCopy(division)} · {divisionFeeCopy(division)}</Text>)}<Text style={styles.sectionLabel}>참가자 정보</Text><View style={styles.choiceCard}><Text style={styles.choiceTitle}>{profile.displayName}</Text><Text style={styles.bodyCopy}>{hasRequiredDupr(profile) ? `DUPR ${profile.duprId}` : 'DUPR 미등록'} · 010-••••-5678</Text><Text style={styles.badge}>대표자</Text></View><Text style={styles.sectionLabel}>복식 파트너 초대</Text><View style={styles.choiceCard}><Text style={styles.bodyCopy}>파트너 전화번호를 입력해 초대하세요</Text><Text style={styles.linkText}>초대하기</Text><Text style={styles.badge}>대기중</Text><Text style={styles.caption}>유효기간 72시간 · 42:18:05 남음 · 링크 재발송</Text></View><Text style={styles.sectionLabel}>약관 동의</Text><Text style={styles.caption}>[필수] 개인정보 수집·이용에 동의합니다{`\n`}[필수] 환불 규정을 확인하였습니다{`\n`}신청 후 참가자 직접 취소와 환불은 1:1 문의로 운영자가 안내합니다. 결제는 실시간 PG 없이 운영자 확인 후 오프라인으로 안내됩니다.</Text>{!profileReady ? <Text testID="application-blocker" style={styles.blockerText}>{REQUIRED_DUPR_ERROR}: DUPR 정보를 저장한 뒤 참가 신청을 진행할 수 있어요.</Text> : null}<Pressable testID="application-cta" accessibilityRole="button" accessibilityState={{ disabled: !profileReady }} disabled={!profileReady} onPress={submitApplication} style={[styles.primaryAction, !profileReady && styles.disabledAction]}><Text style={styles.primaryActionText}>{profileReady ? '참가 신청하기' : 'DUPR 등록 후 신청 가능'}</Text></Pressable>{application ? <Text testID="application-submitted" style={styles.statusStrong}>{applicationSubmittedLabel(apiMode)} · 접수 부문 {submittedDivisionName} · {describeApplicationPolicy(application)}</Text> : null}</View>
    </ParticipantRouteScaffold>
  );
}

export function SupportScreen() {
  const { supportRefundPolicyCopy, supportCenter, routeStatus, supportInquirySubmission } = useParticipantFlow();

  return (
    <ParticipantRouteScaffold active="mypage">
      <View testID="support-center" style={styles.supportCard}><Text style={styles.sectionLabel}>고객센터</Text><RouteStatusNotice status={routeStatus.support} /><Text style={styles.sectionTitle}>자주 묻는 질문</Text><Text testID="support-copy" style={styles.bodyCopy}>{supportRefundPolicyCopy}</Text><Text style={styles.caption}>참가자 직접 취소/환불은 MVP에서 비활성화되어 있으며, 환불·취소 요청은 1:1 문의로 운영자가 확인합니다.</Text><ActionButton testID="support-inquiry-submit" label={supportInquirySubmission === 'submitting' ? '1:1 문의 접수 중' : '환불/취소 1:1 문의 접수'} onPress={submitSupportInquiry} disabled={supportInquirySubmission === 'submitting'} />{supportInquirySubmission === 'submitted' ? <Text testID="support-inquiry-state" style={styles.statusStrong}>1:1 문의가 접수되었습니다. 운영자가 확인 후 안내합니다.</Text> : null}{supportInquirySubmission === 'fallback' ? <Text testID="support-inquiry-state" style={styles.blockerText}>문의 접수에 실패했습니다. 카카오톡 또는 이메일 1:1 문의로 접수해 주세요.</Text> : null}{supportCenter.inquiries.map((inquiry) => <Text key={inquiry.inquiryId} style={styles.caption}>문의 상태: {inquiry.subject} · {inquiry.status}</Text>)}<View style={styles.actionRow}><Text style={styles.secondaryPill}>카카오톡 1:1 문의</Text><Text style={styles.secondaryPill}>이메일 1:1 문의</Text></View><Text style={styles.caption}>운영시간: {supportCenter.operatingHours}{`\n`}{supportCenter.contactEmail} (1:1 문의 접수용){`\n`}대한피클볼협회 운영</Text></View>
    </ParticipantRouteScaffold>
  );
}

export function GamesScreen() {
  const { participantGames, routeStatus } = useParticipantFlow();
  return <ParticipantRouteScaffold active="games"><View testID="my-games-screen" style={styles.sectionCard}><Text style={styles.sectionLabel}>내 경기</Text><RouteStatusNotice status={routeStatus.games} />{participantGames.length ? participantGames.map((game) => <View key={game.gameId} testID="participant-game-card" style={styles.choiceCard}><Text style={styles.sectionTitle}>{game.tournamentTitle}</Text><Text style={styles.bodyCopy}>{formatTournamentDate(game.startsAt)} · {game.location}</Text><Text style={styles.bodyCopy}>{game.divisionName ?? '부문 확인 중'} · 신청 {game.applicationStatus}</Text><Text style={styles.caption}>결제 상태: {game.paymentStatus}{game.paymentAmountKrw ? ` · ${game.paymentAmountKrw.toLocaleString('ko-KR')}원` : ''}</Text></View>) : <Text testID="games-empty" style={styles.caption}>아직 표시할 경기 일정이 없습니다. 대회 신청이 접수되면 여기에 표시됩니다.</Text>}<Text style={styles.caption}>점수 입력 · 결과 확정 · 대진표 운영은 운영자 안내 후 순차적으로 제공됩니다.</Text></View></ParticipantRouteScaffold>;
}

export function NotificationsScreen() {
  const { notifications, routeStatus } = useParticipantFlow();
  return <ParticipantRouteScaffold active="notifications"><View testID="notifications-screen" style={styles.sectionCard}><Text style={styles.sectionLabel}>알림</Text><RouteStatusNotice status={routeStatus.notifications} />{notifications.length ? notifications.map((notification) => <View key={notification.notificationId}><Text style={styles.sectionTitle}>{notification.title}</Text><Text style={styles.bodyCopy}>{notification.body}</Text></View>) : <Text testID="notifications-empty" style={styles.caption}>아직 표시할 알림이 없습니다. 대회 신청, 1:1 문의 답변, 운영자 공지가 생기면 여기에 표시됩니다.</Text>}</View></ParticipantRouteScaffold>;
}

export function MyPageScreen() {
  const { profile, application, paymentRecords, routeStatus, tournamentDivisions } = useParticipantFlow();
  const availableDivisions = getAvailableDivisions(tournamentDivisions);
  const paymentCopy = paymentRecords[0] ? `${paymentRecords[0].status} · ${paymentRecords[0].amountKrw.toLocaleString('ko-KR')}원 · 오프라인 운영자 확인` : '결제 내역 없음 · 오프라인 결제는 운영자 확인 대기';
  const recentApplicationCopy = application ? `최근 신청 · 접수 부문 ${getApplicationDivisionName(application, availableDivisions)}` : undefined;
  return <ParticipantRouteScaffold active="mypage"><View testID="mypage-screen" style={styles.sectionCard}><Text style={styles.sectionLabel}>마이</Text><RouteStatusNotice status={routeStatus.mypage} /><Text style={styles.sectionTitle}>{profile.displayName} · DUPR {hasRequiredDupr(profile) ? profile.duprId : '미등록'}</Text><Text style={styles.bodyCopy}>송파피클볼클럽</Text><Text testID="mypage-payment-status" style={styles.bodyCopy}>{paymentCopy}</Text>{recentApplicationCopy ? <Text testID="mypage-recent-application" style={styles.caption}>{recentApplicationCopy}</Text> : null}<Text style={styles.caption}>프로필 수정 · 내 경기 기록 · 결제 내역 · DUPR 정보 관리 · 알림 설정 · 고객센터 · 로그아웃</Text><ActionButton testID="mypage-dupr-button" label="DUPR 정보 관리" secondary onPress={() => router.push('/dupr-profile')} /><ActionButton testID="mypage-support-button" label="고객센터" secondary onPress={() => router.push('/support')} /></View></ParticipantRouteScaffold>;
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
