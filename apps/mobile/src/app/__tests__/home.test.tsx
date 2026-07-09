import { render, screen, fireEvent } from '@testing-library/react-native';
import Home from '../index';

describe('Home screen', () => {
  it('renders the PickleHub Figma-first participant shell and MVP boundaries', () => {
    render(<Home />);

    expect(screen.getByTestId('home-title')).toHaveTextContent('PickleHub tournament days, composed like a clean court.');
    expect(screen.getByText(/SOCIAL LOGIN ONLY · DUPR REQUIRED · 1:1 INQUIRY/)).toBeTruthy();
    expect(screen.getByTestId('support-copy')).toHaveTextContent('Need help? Use 1:1 inquiry support near your application. Participant self-cancel/refund is not available in this MVP slice.');
    expect(screen.getByText(/No Admin Web in this slice/)).toBeTruthy();
  });

  it('keeps the social login and DUPR gate before local application submit', () => {
    render(<Home />);

    expect(screen.getByTestId('dupr-gate-status')).toHaveTextContent('DUPR ID required before tournament application.');
    expect(screen.getByTestId('application-blocker')).toHaveTextContent('DUPR_PROFILE_REQUIRED: Add your DUPR ID to apply. Start social login, then save a DUPR ID in your participant profile.');

    fireEvent.press(screen.getByTestId('social-login-button'));
    fireEvent.changeText(screen.getByTestId('dupr-input'), 'DUPR-12345');
    fireEvent.press(screen.getByTestId('save-dupr-button'));

    expect(screen.getByTestId('saved-dupr')).toHaveTextContent('Saved DUPR ID: DUPR-12345');
    expect(screen.getByTestId('dupr-gate-status')).toHaveTextContent('Application readiness unlocked.');

    fireEvent.press(screen.getByTestId('application-cta'));
    expect(screen.getByTestId('application-submitted')).toHaveTextContent('Mock application submitted: application_tournament_sandbox_001_participant_sandbox_001');
  });

  it('uses the Figma-derived monochrome and pastel visual system', () => {
    render(<Home />);

    expect(screen.getByTestId('home-title')).toHaveStyle({ color: '#000000', fontSize: 54 });
    expect(screen.getByTestId('application-cta')).toHaveStyle({ backgroundColor: '#ffffff', borderRadius: 50 });
    expect(screen.getByTestId('mock-tournament-card')).toHaveStyle({ backgroundColor: '#f4ecd6', borderRadius: 24 });
  });
});
