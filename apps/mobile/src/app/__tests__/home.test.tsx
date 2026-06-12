import { render, screen, fireEvent } from '@testing-library/react-native';
import Home from '../index';

const { registerCSS } = require('react-native-css/jest') as {
  registerCSS: (css: string) => void;
};

describe('Home screen', () => {
  beforeEach(() => {
    registerCSS(`
      .bg-primary { background-color: #2563eb; }
      .text-foreground { color: #0f172a; }
      .text-primary-foreground { color: #f8fafc; }
    `);
  });

  it('renders configured title and increments the counter', () => {
    render(<Home />);
    expect(screen.getByTestId('home-title')).toHaveTextContent('Mobile App Template');
    expect(screen.getByTestId('counter-value')).toHaveTextContent('Count: 0');
    fireEvent.press(screen.getByTestId('counter-increment-button'));
    expect(screen.getByTestId('counter-value')).toHaveTextContent('Count: 1');
  });

  it('applies NativeWind semantic classes in the Jest runtime', () => {
    render(<Home />);
    expect(screen.getByTestId('home-title')).toHaveStyle({ color: '#0f172a' });
    expect(screen.getByTestId('counter-increment-button')).toHaveStyle({ backgroundColor: '#2563eb' });
  });
});
