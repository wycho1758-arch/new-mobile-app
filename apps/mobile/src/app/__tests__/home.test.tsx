import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import Home, {
  DuprProfileScreen,
  MyPageScreen,
  SupportScreen,
  TournamentApplicationScreen,
  TournamentDetailScreen,
  TournamentsScreen,
  resetParticipantFlow,
  saveParticipantDupr,
  startParticipantSession,
} from '../index';
import { createParticipantApiClient } from '../../participant/api-client';
import { sandboxParticipantSession } from '../../participant/mock-session';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

const mockPush = router.push as jest.Mock;

describe('Home screen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    resetParticipantFlow();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the Korean login-first screen and routes social login to tournaments', () => {
    render(<Home />);

    expect(screen.getByTestId('login-artboard')).toBeTruthy();
    expect(screen.getByTestId('login-logo').props.accessibilityLabel).toBe('Happickle');
    expect(screen.getByTestId('login-logo-text')).toHaveTextContent('Happickle');
    expect(screen.getByTestId('login-subtitle')).toHaveTextContent('대한피클볼협회 공식 대회 플랫폼');
    expect(screen.getByTestId('kakao-login-button')).toHaveTextContent('카카오로 계속하기');
    expect(screen.getByTestId('apple-login-button')).toHaveTextContent('Apple로 계속하기');
    expect(screen.getByTestId('login-consent-copy')).toHaveTextContent('처음이시면 자동으로 회원가입이 진행돼요');
    expect(screen.queryByTestId('application-cta')).toBeNull();
    expect(screen.queryByText(/Admin Web/i)).toBeNull();

    fireEvent.press(screen.getByTestId('apple-login-button'));
    expect(mockPush).toHaveBeenLastCalledWith('/tournaments');
  });

  it('uses route targets from the tournament list page', () => {
    startParticipantSession();
    render(<TournamentsScreen />);

    expect(screen.getByTestId('header-logo')).toHaveStyle({ marginTop: 0 });
    expect(screen.getByTestId('explore-home')).toHaveTextContent(/어떤 대회에 나가볼까요/);
    expect(screen.queryByTestId('participant-route-state')).toBeNull();

    fireEvent.press(screen.getByTestId('mock-tournament-card'));
    expect(mockPush).toHaveBeenLastCalledWith(`/tournaments/${sandboxParticipantSession.featuredTournament.tournamentId}`);

    fireEvent.press(screen.getByTestId('go-support-button'));
    expect(mockPush).toHaveBeenLastCalledWith('/support');

    fireEvent.press(screen.getByTestId('go-dupr-button'));
    expect(mockPush).toHaveBeenLastCalledWith('/dupr-profile');
  });

  it('routes tournament detail application CTA through the DUPR gate', () => {
    startParticipantSession();
    render(<TournamentDetailScreen />);

    expect(screen.getByTestId('tournament-detail')).toHaveTextContent(/대회요강/);
    expect(screen.getByTestId('tournament-detail')).toHaveTextContent(/참가자 직접 취소 불가 · 1:1 문의/);
    fireEvent.press(screen.getByTestId('detail-apply-button'));
    expect(mockPush).toHaveBeenLastCalledWith('/dupr-profile');
  });

  it('saves DUPR and routes back to the tournament application URL', () => {
    startParticipantSession();
    render(<DuprProfileScreen />);

    expect(screen.getByTestId('dupr-gate-status')).toHaveTextContent('참가 신청 전 DUPR 정보가 필요해요');
    fireEvent.changeText(screen.getByTestId('dupr-input'), 'DUPR-12345');
    fireEvent.press(screen.getByTestId('save-dupr-button'));
    expect(screen.getByTestId('saved-dupr')).toHaveTextContent('현재 DUPR DUPR-12345 · 관리자 확인중');
    expect(screen.getByTestId('dupr-gate-status')).toHaveTextContent('현재 DUPR 저장됨');

    fireEvent.press(screen.getByTestId('dupr-continue-application'));
    expect(mockPush).toHaveBeenLastCalledWith(`/tournaments/${sandboxParticipantSession.featuredTournament.tournamentId}/apply`);
  });

  it('submits a mock application only after DUPR is present', () => {
    startParticipantSession();
    saveParticipantDupr('DUPR-12345');
    render(<TournamentApplicationScreen />);

    expect(screen.getByTestId('application-cta').props.accessibilityState).toMatchObject({ disabled: false });
    fireEvent.press(screen.getByTestId('application-cta'));
    expect(screen.getByTestId('application-submitted')).toHaveTextContent(/Mock application submitted: application_tournament_sandbox_001_participant_sandbox_001/);
    expect(screen.getByTestId('application-submitted')).toHaveTextContent(/참가자 직접 취소 불가 · 1:1 문의/);
  });

  it('opens bottom tabs and my page shortcuts through route pushes', () => {
    startParticipantSession();
    render(<TournamentsScreen />);

    fireEvent.press(screen.getByTestId('bottom-tab-games'));
    expect(mockPush).toHaveBeenLastCalledWith('/games');

    fireEvent.press(screen.getByTestId('bottom-tab-notifications'));
    expect(mockPush).toHaveBeenLastCalledWith('/notifications');

    fireEvent.press(screen.getByTestId('bottom-tab-mypage'));
    expect(mockPush).toHaveBeenLastCalledWith('/mypage');
  });

  it('routes my page shortcuts to support and DUPR profile', () => {
    startParticipantSession();
    render(<MyPageScreen />);

    expect(screen.getByTestId('mypage-screen')).toHaveTextContent(/프로필 수정/);
    fireEvent.press(screen.getByTestId('mypage-support-button'));
    expect(mockPush).toHaveBeenLastCalledWith('/support');

    fireEvent.press(screen.getByTestId('mypage-dupr-button'));
    expect(mockPush).toHaveBeenLastCalledWith('/dupr-profile');
  });

  it('renders support copy on the support route', () => {
    startParticipantSession();
    render(<SupportScreen />);

    expect(screen.getByTestId('support-copy')).toHaveTextContent(/1:1 문의로 접수/);
    expect(screen.getByTestId('support-copy')).toHaveTextContent(/Participant self-cancel\/refund is not available/);
    expect(screen.getByTestId('support-center')).toHaveTextContent(/support@happickle\.kr \(1:1 문의 접수용\)/);
  });

  it('uses the login reference dark surround, white artboard, and social button colors', () => {
    render(<Home />);

    expect(screen.getByTestId('login-artboard')).toHaveStyle({ backgroundColor: '#f7faf8', maxWidth: 480 });
    expect(screen.getByTestId('login-illustration')).toHaveStyle({ backgroundColor: '#e9f1ea', borderRadius: 42 });
    expect(screen.getByTestId('kakao-login-button')).toHaveStyle({ backgroundColor: '#fee500', borderRadius: 14 });
    expect(screen.getByTestId('apple-login-button')).toHaveStyle({ backgroundColor: '#1f2937', borderRadius: 14 });
  });

  it('exercises the participant API client from the UI when injected/enabled', async () => {
    const apiClient = createParticipantApiClient({
      baseUrl: 'https://api.example.invalid',
      bearerToken: 'test-token',
      fetchImpl: jest.fn(async (url: string, init?: RequestInit) => {
        const body = JSON.parse(String(init?.body ?? '{}'));
        if (url.endsWith('/api/tournaments')) return { ok: true, status: 200, json: async () => ({ tournaments: [{ tournamentId: 'tournament_api_001', title: 'API Open', division: 'Mixed Doubles', location: 'API Court', startsAt: '2026-08-09T00:00:00.000Z', applicationStatus: 'available', requiresDupr: true, paymentMode: 'operatorManagedOffline', cancellationPolicy: 'operatorSupportOnly' }] }) } as Response;
        if (url.endsWith('/api/participant/profile') && init?.method === 'GET') return { ok: true, status: 200, json: async () => ({ participantId: 'participant_api_001', displayName: 'API Player', duprStatus: 'missing', supportChannel: 'oneToOneInquiry' }) } as Response;
        return { ok: true, status: 200, json: async () => ({ ...body, participantId: 'participant_api_001', displayName: 'API Player', duprStatus: 'selfReportedPendingOperatorReview', supportChannel: 'oneToOneInquiry' }) } as Response;
      }) as unknown as typeof fetch,
    });

    resetParticipantFlow(apiClient);
    startParticipantSession();
    render(<TournamentsScreen />);

    await waitFor(() => expect(screen.getByTestId('participant-api-mode')).toHaveTextContent('API 연결됨'));
    expect(screen.getByTestId('mock-tournament-card')).toHaveTextContent(/API Open/);
  });
});
