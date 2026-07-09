import { render, screen, fireEvent } from '@testing-library/react-native';
import Home from '../index';

describe('Home screen', () => {
  it('renders the Figma-reference login-first screen with social providers', () => {
    render(<Home />);

    expect(screen.getByTestId('login-artboard')).toBeTruthy();
    expect(screen.getByTestId('login-logo')).toHaveTextContent('Hagpickle');
    expect(screen.getByTestId('login-subtitle')).toHaveTextContent('대회일정을 편리하게 모아 보는 플랫폼');
    expect(screen.getByTestId('kakao-login-button')).toHaveTextContent('카카오로 계속하기');
    expect(screen.getByTestId('apple-login-button')).toHaveTextContent('Apple로 계속하기');
    expect(screen.getByTestId('login-consent-copy')).toHaveTextContent('계속하시면 자동으로 회원가입이 진행돼요');
    expect(screen.queryByTestId('application-cta')).toBeNull();
    expect(screen.queryByText(/Admin Web/i)).toBeNull();
  });

  it('keeps the social login and DUPR gate before local application submit', () => {
    render(<Home />);

    fireEvent.press(screen.getByTestId('apple-login-button'));

    expect(screen.getByTestId('dupr-gate-status')).toHaveTextContent('DUPR ID required before tournament application.');
    expect(screen.getByTestId('application-blocker')).toHaveTextContent('DUPR_PROFILE_REQUIRED: Add your DUPR ID to apply. Start social login, then save a DUPR ID in your participant profile.');

    fireEvent.changeText(screen.getByTestId('dupr-input'), 'DUPR-12345');
    fireEvent.press(screen.getByTestId('save-dupr-button'));

    expect(screen.getByTestId('saved-dupr')).toHaveTextContent('Saved DUPR ID: DUPR-12345');
    expect(screen.getByTestId('dupr-gate-status')).toHaveTextContent('Application readiness unlocked.');

    fireEvent.press(screen.getByTestId('application-cta'));
    expect(screen.getByTestId('application-submitted')).toHaveTextContent('Mock application submitted: application_tournament_sandbox_001_participant_sandbox_001');
  });

  it('uses the login reference dark surround, white artboard, and social button colors', () => {
    render(<Home />);

    expect(screen.getByTestId('login-artboard')).toHaveStyle({ backgroundColor: '#f8faf9' });
    expect(screen.getByTestId('kakao-login-button')).toHaveStyle({ backgroundColor: '#ffdf00', borderRadius: 12 });
    expect(screen.getByTestId('apple-login-button')).toHaveStyle({ backgroundColor: '#172233', borderRadius: 8 });
  });
});
