import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Env } from '../../env';
import {
  type MockTournamentApplication,
  REQUIRED_DUPR_ERROR,
  hasRequiredDupr,
  sandboxParticipantSession,
  saveSandboxDupr,
  submitSandboxTournamentApplication,
} from '../participant/mock-session';

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

  return (
    <View className="flex-1 justify-center gap-5 bg-background px-6">
      <View className="gap-2">
        <Text testID="home-title" className="text-2xl font-bold text-foreground">
          PickleHub Participant APP
        </Text>
        <Text className="text-base text-foreground">
          {Env.APP_DISPLAY_NAME} sandbox shell for tournament participants.
        </Text>
      </View>

      <View className="gap-2 rounded-2xl border border-border bg-card p-4">
        <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Welcome / Login</Text>
        <Text className="text-lg font-semibold text-foreground">Start your participant session</Text>
        <Text className="text-sm text-muted-foreground">
          Continue with a social account to create a participant session. Email/password login is not available in this slice.
        </Text>
        <Pressable
          testID="social-login-button"
          accessibilityRole="button"
          onPress={() => setSocialSessionStarted(true)}
          className="rounded-xl bg-primary px-5 py-3"
        >
          <Text className="text-center font-medium text-primary-foreground">Continue with social login</Text>
        </Pressable>
        {socialSessionStarted ? (
          <Text testID="session-actor" className="text-sm text-foreground">
            Sandbox participant session: {sandboxParticipantSession.sessionActor.actorId}
          </Text>
        ) : null}
      </View>

      <View className="gap-2 rounded-2xl border border-border bg-card p-4">
        <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">DUPR gate</Text>
        <Text className="text-lg font-semibold text-foreground">Add your DUPR ID to apply</Text>
        <Text className="text-sm text-muted-foreground">
          Add your DUPR ID to apply for mock tournaments. The ID is saved locally in this sandbox, and no live DUPR lookup runs here.
        </Text>
        <TextInput
          testID="dupr-input"
          accessibilityLabel="DUPR ID"
          editable={socialSessionStarted}
          onChangeText={setDuprInput}
          placeholder="Enter DUPR ID"
          value={duprInput}
          className="rounded-xl border border-border px-4 py-3 text-foreground"
        />
        <Pressable
          testID="save-dupr-button"
          accessibilityRole="button"
          accessibilityState={{ disabled: !socialSessionStarted }}
          disabled={!socialSessionStarted}
          onPress={saveDupr}
          className={`rounded-xl px-5 py-3 ${socialSessionStarted ? 'bg-secondary' : 'bg-muted'}`}
        >
          <Text className="text-center font-medium text-foreground">Save DUPR ID</Text>
        </Pressable>
        {hasRequiredDupr(profile) ? (
          <Text testID="saved-dupr" className="text-sm font-semibold text-foreground">
            Saved DUPR ID: {profile.duprId}
          </Text>
        ) : null}
      </View>

      <View className="gap-3 rounded-2xl border border-border bg-card p-4">
        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tournament list preview</Text>
          <View testID="mock-tournament-card" className="gap-1 rounded-xl border border-border p-3">
            <Text className="text-base font-semibold text-foreground">{featuredTournament.title}</Text>
            <Text className="text-sm text-muted-foreground">{featuredTournament.division}</Text>
            <Text className="text-sm text-muted-foreground">{featuredTournament.location}</Text>
            <Text className="text-xs text-muted-foreground">
              Sandbox only: no live payment, refund, social-provider, or backend submission.
            </Text>
          </View>
        </View>

        <View className="gap-2 rounded-xl bg-muted p-3">
          <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Application readiness</Text>
          <Text testID="dupr-gate-status" className="text-sm text-foreground">
            {profileReady ? 'Application readiness unlocked.' : 'DUPR ID required before tournament application.'}
          </Text>
          {!profileReady ? (
            <Text testID="application-blocker" className="text-sm font-semibold text-destructive">
              {REQUIRED_DUPR_ERROR}: Add your DUPR ID to apply. Start social login, then save a DUPR ID in your participant profile.
            </Text>
          ) : null}
          <Text testID="support-copy" className="text-sm text-muted-foreground">
            Need help? Use 1:1 inquiry support near your application. Participant self-cancel/refund is not available in this MVP slice.
          </Text>
        </View>

        <Pressable
          testID="application-cta"
          accessibilityRole="button"
          accessibilityState={{ disabled: !profileReady }}
          disabled={!profileReady}
          onPress={submitApplication}
          className={`rounded-xl px-5 py-3 ${profileReady ? 'bg-primary' : 'bg-muted'}`}
        >
          <Text className="text-center font-medium text-foreground">
            {profileReady ? 'Submit mock application' : 'Application blocked until DUPR is added (DUPR ID required)'}
          </Text>
        </Pressable>
        {application ? (
          <Text testID="application-submitted" className="text-sm font-semibold text-foreground">
            Mock application submitted: {application.applicationId}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
