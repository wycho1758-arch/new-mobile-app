import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  type MockTournamentApplication,
  REQUIRED_DUPR_ERROR,
  hasRequiredDupr,
  sandboxParticipantSession,
  saveSandboxDupr,
  submitSandboxTournamentApplication,
} from '../participant/mock-session';

const palette = {
  ink: '#000000',
  canvas: '#ffffff',
  hairline: '#e6e6e6',
  soft: '#f7f7f5',
  lime: '#dceeb1',
  lilac: '#c5b0f4',
  cream: '#f4ecd6',
  mint: '#c8e6cd',
  coral: '#f3c9b6',
  navy: '#1f1d3d',
  inverse: '#ffffff',
};

export default function Home() {
  const [socialSessionStarted, setSocialSessionStarted] = useState(false);
  const [profile, setProfile] = useState(sandboxParticipantSession.profile);
  const [duprInput, setDuprInput] = useState(profile.duprId ?? '');
  const [application, setApplication] = useState<MockTournamentApplication | null>(null);
  const featuredTournament = sandboxParticipantSession.featuredTournament;
  const profileReady = socialSessionStarted && hasRequiredDupr(profile);

  const saveDupr = () => {
    setProfile(saveSandboxDupr(profile, duprInput));
    setApplication(null);
  };

  const submitApplication = () => {
    setApplication(
      submitSandboxTournamentApplication({
        profile,
        tournament: featuredTournament,
      }),
    );
  };

  if (!socialSessionStarted) {
    return (
      <View style={styles.loginSurround}>
        <Text style={styles.peekLabel}>MCA 로그인</Text>
        <View testID="login-artboard" style={styles.loginArtboard}>
          <View style={styles.loginCenterStack}>
            <View testID="login-logo" accessibilityLabel="Hagpickle logo" style={styles.logoRow}>
              <Text style={[styles.logoText, styles.logoGreen]}>H</Text>
              <Text style={[styles.logoText, styles.logoGreen]}>a</Text>
              <Text style={[styles.logoText, styles.logoOrange]}>g</Text>
              <Text style={[styles.logoText, styles.logoGreen]}>p</Text>
              <Text style={[styles.logoText, styles.logoRed]}>i</Text>
              <Text style={[styles.logoText, styles.logoGreen]}>c</Text>
              <Text style={[styles.logoText, styles.logoGreen]}>k</Text>
              <Text style={[styles.logoText, styles.logoGreen]}>l</Text>
              <Text style={[styles.logoText, styles.logoGreen]}>e</Text>
            </View>
            <Text testID="login-subtitle" style={styles.loginSubtitle}>대회일정을 편리하게 모아 보는 플랫폼</Text>
            <View style={styles.loginIconCircle}>
              <Text style={styles.loginIcon}>⌕</Text>
            </View>
          </View>

          <View style={styles.loginButtonStack}>
            <Pressable
              testID="kakao-login-button"
              accessibilityRole="button"
              onPress={() => setSocialSessionStarted(true)}
              style={styles.kakaoButton}
            >
              <Text style={styles.kakaoButtonText}>카카오로 계속하기</Text>
            </Pressable>
            <Pressable
              testID="apple-login-button"
              accessibilityRole="button"
              onPress={() => setSocialSessionStarted(true)}
              style={styles.appleButton}
            >
              <Text style={styles.appleButtonText}>Apple로 계속하기</Text>
            </Pressable>
            <Text testID="login-consent-copy" style={styles.loginConsent}>계속하시면 자동으로 회원가입이 진행돼요</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.nav}>
        <Text style={styles.navLogo}>PickleHub</Text>
        <Text testID="session-actor" style={styles.sessionText}>
          Sandbox participant session: {sandboxParticipantSession.sessionActor.actorId}
        </Text>
      </View>

      <View style={[styles.colorBlock, styles.limeBlock]}>
        <Text style={styles.eyebrow}>DUPR GATE</Text>
        <Text style={styles.sectionTitle}>A clear eligibility checkpoint before application.</Text>
        <Text style={styles.bodyCopy}>
          Add your DUPR ID to unlock mock tournament application. The ID is saved locally in this sandbox, and no live DUPR lookup runs here.
        </Text>
        <TextInput
          testID="dupr-input"
          accessibilityLabel="DUPR ID"
          onChangeText={setDuprInput}
          placeholder="Enter DUPR ID"
          placeholderTextColor="#6b6b6b"
          value={duprInput}
          style={styles.input}
        />
        <Pressable
          testID="save-dupr-button"
          accessibilityRole="button"
          onPress={saveDupr}
          style={styles.secondaryAction}
        >
          <Text style={styles.secondaryActionText}>Save DUPR ID</Text>
        </Pressable>
        {hasRequiredDupr(profile) ? (
          <Text testID="saved-dupr" style={styles.statusStrong}>
            Saved DUPR ID: {profile.duprId}
          </Text>
        ) : null}
      </View>

      <View style={styles.twoColumnSection}>
        <View testID="mock-tournament-card" style={[styles.editorialCard, styles.creamCard]}>
          <Text style={styles.eyebrow}>FEATURED TOURNAMENT</Text>
          <Text style={styles.cardTitle}>{featuredTournament.title}</Text>
          <Text style={styles.bodyCopy}>{featuredTournament.division}</Text>
          <Text style={styles.bodyCopy}>{featuredTournament.location}</Text>
          <View style={styles.hairline} />
          <Text style={styles.caption}>Sandbox only: no live payment, refund, social-provider, or backend submission.</Text>
        </View>

        <View style={[styles.editorialCard, styles.mintCard]}>
          <Text style={styles.eyebrow}>APPLICATION READINESS</Text>
          <Text testID="dupr-gate-status" style={styles.cardTitle}>
            {profileReady ? 'Application readiness unlocked.' : 'DUPR ID required before tournament application.'}
          </Text>
          {!profileReady ? (
            <Text testID="application-blocker" style={styles.blockerText}>
              {REQUIRED_DUPR_ERROR}: Add your DUPR ID to apply. Start social login, then save a DUPR ID in your participant profile.
            </Text>
          ) : null}
          <Text testID="support-copy" style={styles.bodyCopy}>
            Need help? Use 1:1 inquiry support near your application. Participant self-cancel/refund is not available in this MVP slice.
          </Text>
        </View>
      </View>

      <View style={[styles.colorBlock, styles.navyBlock]}>
        <Text style={[styles.eyebrow, styles.inverseText]}>LOCAL APPLICATION FLOW</Text>
        <Text style={[styles.sectionTitle, styles.inverseText]}>Submit only when the social session and DUPR gate are both ready.</Text>
        <Pressable
          testID="application-cta"
          accessibilityRole="button"
          accessibilityState={{ disabled: !profileReady }}
          disabled={!profileReady}
          onPress={submitApplication}
          style={[styles.inversePill, !profileReady && styles.inversePillDisabled]}
        >
          <Text style={styles.inversePillText}>
            {profileReady ? 'Submit mock application' : 'Application blocked until DUPR is added (DUPR ID required)'}
          </Text>
        </Pressable>
        {application ? (
          <Text testID="application-submitted" style={[styles.statusStrong, styles.inverseText]}>
            Mock application submitted: {application.applicationId}
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const fontSans = 'Inter, SF Pro Display, system-ui, sans-serif';
const fontMono = 'JetBrains Mono, SF Mono, Menlo, monospace';

const styles = StyleSheet.create({

  loginSurround: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#202020',
    minHeight: 640,
    overflow: 'hidden',
    paddingTop: 60,
  },
  peekLabel: {
    color: '#5faa72',
    fontFamily: fontSans,
    fontSize: 20,
    fontWeight: '400',
    left: '24%',
    position: 'absolute',
    top: 36,
  },
  loginArtboard: {
    alignItems: 'center',
    backgroundColor: '#f8faf9',
    height: 627,
    justifyContent: 'center',
    maxWidth: 382,
    paddingHorizontal: 40,
    width: '64%',
  },
  loginCenterStack: {
    alignItems: 'center',
    gap: 8,
    marginTop: 54,
  },
  logoRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  logoText: {
    fontFamily: fontSans,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 24,
  },
  logoGreen: {
    color: '#68b568',
  },
  logoOrange: {
    color: '#f2b449',
  },
  logoRed: {
    color: '#ed6f5e',
  },
  loginSubtitle: {
    color: '#5f6760',
    fontFamily: fontSans,
    fontSize: 11,
    fontWeight: '500',
  },
  loginIconCircle: {
    alignItems: 'center',
    backgroundColor: '#e8f3ec',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginTop: 28,
    width: 80,
  },
  loginIcon: {
    color: '#4a9b64',
    fontFamily: fontSans,
    fontSize: 30,
    lineHeight: 34,
  },
  loginButtonStack: {
    gap: 12,
    marginTop: 88,
    maxWidth: 304,
    width: '100%',
  },
  kakaoButton: {
    alignItems: 'center',
    backgroundColor: '#ffdf00',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 49,
  },
  kakaoButtonText: {
    color: '#262100',
    fontFamily: fontSans,
    fontSize: 13,
    fontWeight: '800',
  },
  appleButton: {
    alignItems: 'center',
    backgroundColor: '#172233',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 47,
  },
  appleButtonText: {
    color: palette.inverse,
    fontFamily: fontSans,
    fontSize: 13,
    fontWeight: '800',
  },
  loginConsent: {
    color: '#8b918c',
    fontFamily: fontSans,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  },
  page: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  content: {
    gap: 32,
    padding: 24,
    paddingBottom: 56,
  },
  nav: {
    minHeight: 56,
    alignItems: 'center',
    borderColor: palette.hairline,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  navLogo: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 18,
    fontWeight: '700',
  },
  navLink: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 14,
    fontWeight: '300',
  },
  navButton: {
    backgroundColor: palette.ink,
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  navButtonText: {
    color: palette.inverse,
    fontFamily: fontSans,
    fontSize: 14,
    fontWeight: '500',
  },
  hero: {
    gap: 18,
    paddingVertical: 32,
  },
  eyebrow: {
    color: palette.ink,
    fontFamily: fontMono,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.6,
  },
  display: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 54,
    fontWeight: '300',
    letterSpacing: -1.1,
    lineHeight: 56,
  },
  lede: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 28,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  primaryPill: {
    backgroundColor: palette.ink,
    borderRadius: 50,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  primaryPillText: {
    color: palette.inverse,
    fontFamily: fontSans,
    fontSize: 18,
    fontWeight: '500',
  },
  secondaryPill: {
    backgroundColor: palette.canvas,
    borderColor: palette.hairline,
    borderRadius: 50,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  secondaryPillText: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 18,
    fontWeight: '500',
  },
  sessionText: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 16,
    fontWeight: '500',
  },
  marquee: {
    backgroundColor: palette.ink,
    borderRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  marqueeText: {
    color: palette.inverse,
    fontFamily: fontSans,
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  colorBlock: {
    borderRadius: 24,
    gap: 18,
    padding: 32,
  },
  limeBlock: {
    backgroundColor: palette.lime,
  },
  navyBlock: {
    backgroundColor: palette.navy,
  },
  sectionTitle: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  bodyCopy: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 18,
    fontWeight: '300',
    lineHeight: 26,
  },
  input: {
    backgroundColor: palette.canvas,
    borderColor: palette.hairline,
    borderRadius: 8,
    borderWidth: 1,
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  disabledInput: {
    opacity: 0.55,
  },
  secondaryAction: {
    alignSelf: 'flex-start',
    backgroundColor: palette.canvas,
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  disabledAction: {
    opacity: 0.55,
  },
  secondaryActionText: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 18,
    fontWeight: '500',
  },
  statusStrong: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 16,
    fontWeight: '700',
  },
  twoColumnSection: {
    gap: 16,
  },
  editorialCard: {
    borderColor: palette.hairline,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 24,
  },
  creamCard: {
    backgroundColor: palette.cream,
  },
  mintCard: {
    backgroundColor: palette.mint,
  },
  cardTitle: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 34,
  },
  hairline: {
    backgroundColor: palette.hairline,
    height: 1,
  },
  caption: {
    color: palette.ink,
    fontFamily: fontMono,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.6,
    lineHeight: 16,
  },
  blockerText: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 23,
  },
  inverseText: {
    color: palette.inverse,
  },
  inversePill: {
    alignSelf: 'flex-start',
    backgroundColor: palette.inverse,
    borderRadius: 50,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  inversePillDisabled: {
    opacity: 0.5,
  },
  inversePillText: {
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: 18,
    fontWeight: '500',
  },
  footer: {
    borderColor: palette.hairline,
    borderTopWidth: 1,
    paddingTop: 24,
  },
});
