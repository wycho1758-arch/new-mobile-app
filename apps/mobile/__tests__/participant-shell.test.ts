import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import Home from '../src/app';
import {
  REQUIRED_DUPR_ERROR,
  hasRequiredDupr,
  sandboxParticipantSession,
  saveSandboxDupr,
  submitSandboxTournamentApplication,
} from '../src/participant/mock-session';

describe('participant shell sandbox contract', () => {
  it('uses a participant social session actor shape', () => {
    expect(sandboxParticipantSession.sessionActor).toMatchObject({
      actorId: expect.any(String),
      role: 'participant',
      participantId: expect.any(String),
      scopes: expect.arrayContaining([
        'participant:profile:read',
        'participant:profile:update',
        'participant:application:create',
      ]),
      sessionId: expect.any(String),
      issuedAt: expect.any(String),
    });
  });

  it('blocks application readiness when DUPR ID is missing', () => {
    expect(hasRequiredDupr(sandboxParticipantSession.profile)).toBe(false);
    expect(REQUIRED_DUPR_ERROR).toBe('DUPR_PROFILE_REQUIRED');
    expect(() =>
      submitSandboxTournamentApplication({
        profile: sandboxParticipantSession.profile,
        tournament: sandboxParticipantSession.featuredTournament,
      }),
    ).toThrow(REQUIRED_DUPR_ERROR);
  });

  it('unlocks readiness and creates a local-only mock application when DUPR ID is present', () => {
    expect(hasRequiredDupr({ duprId: '  ' })).toBe(false);

    const readyProfile = saveSandboxDupr(sandboxParticipantSession.profile, ' dupr-12345 ');
    expect(readyProfile.duprId).toBe('DUPR-12345');
    expect(hasRequiredDupr(readyProfile)).toBe(true);

    expect(
      submitSandboxTournamentApplication({
        profile: readyProfile,
        tournament: sandboxParticipantSession.featuredTournament,
        submittedAt: '2026-07-08T01:00:00.000Z',
      }),
    ).toMatchObject({
      tournamentId: sandboxParticipantSession.featuredTournament.tournamentId,
      participantId: readyProfile.participantId,
      duprId: 'DUPR-12345',
      status: 'submitted',
      supportChannel: 'oneToOneInquiry',
      paymentStatus: 'notStartedSandbox',
      refundPolicy: 'participantSelfCancelDisabled',
    });
  });

  it('starts on the Korean social-login screen before showing participant application gates', () => {
    render(React.createElement(Home));

    expect(screen.getByTestId('login-artboard')).toBeTruthy();
    expect(screen.getByTestId('login-logo')).toHaveTextContent('Hagpickle');
    expect(screen.getByTestId('login-subtitle')).toHaveTextContent('대회일정을 편리하게 모아 보는 플랫폼');
    expect(screen.getByTestId('kakao-login-button')).toHaveTextContent('카카오로 계속하기');
    expect(screen.getByTestId('apple-login-button')).toHaveTextContent('Apple로 계속하기');
    expect(screen.getByTestId('login-consent-copy')).toHaveTextContent('계속하시면 자동으로 회원가입이 진행돼요');
    expect(screen.queryByTestId('application-cta')).toBeNull();
    expect(screen.queryByTestId('mock-tournament-card')).toBeNull();
  });

  it('lets a sandbox participant start session, save DUPR, and submit a mock application', () => {
    render(React.createElement(Home));

    fireEvent.press(screen.getByTestId('kakao-login-button'));

    expect(screen.getByTestId('application-cta').props.accessibilityState).toMatchObject({ disabled: true });
    expect(screen.getByTestId('application-cta')).toHaveTextContent(/DUPR ID required/);
    expect(screen.getByTestId('application-blocker')).toHaveTextContent(new RegExp(REQUIRED_DUPR_ERROR));
    expect(screen.getByTestId('application-blocker')).toHaveTextContent(/Add your DUPR ID to apply/);
    expect(screen.getByTestId('mock-tournament-card')).toBeTruthy();

    fireEvent.changeText(screen.getByTestId('dupr-input'), 'dupr-777');
    fireEvent.press(screen.getByTestId('save-dupr-button'));

    expect(screen.getByTestId('saved-dupr')).toHaveTextContent(/DUPR-777/);
    expect(screen.getByTestId('dupr-gate-status')).toHaveTextContent(/Application readiness unlocked/);
    expect(screen.getByTestId('application-cta').props.accessibilityState).toMatchObject({ disabled: false });

    fireEvent.press(screen.getByTestId('application-cta'));

    expect(screen.getByTestId('application-submitted')).toHaveTextContent(/Mock application submitted/);
    expect(screen.getByTestId('support-copy')).toHaveTextContent(/1:1 inquiry support/);
    expect(screen.getByTestId('support-copy')).toHaveTextContent(/Participant self-cancel\/refund is not available/);
  });
});
