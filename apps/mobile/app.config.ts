import { ExpoConfig, ConfigContext } from 'expo/config';

type MobileExpoConfig = ExpoConfig & {
  newArchEnabled?: boolean;
};

function readConfigValue(name: string, fallback: string): string {
  const value = process.env[name];
  const requiresExplicitValue = process.env.EAS_BUILD === 'true'
    || process.env.EXPO_PUBLIC_APP_ENV === 'preview'
    || process.env.EXPO_PUBLIC_APP_ENV === 'production';

  if (value) return value;
  if (!requiresExplicitValue) return fallback;

  throw new Error(`${name} is required for preview, production, and EAS build config.`);
}

function readConfigUrl(name: string, fallback: string): string {
  const value = readConfigValue(name, fallback);
  try {
    new URL(value);
  } catch {
    throw new Error(`${name} must be a valid URL for preview, production, and EAS build config.`);
  }
  return value;
}

// Read process.env directly here — @expo/config's evalConfig uses sucrase + require-from-string
// which cannot resolve TypeScript files via require('./env') in a monorepo with "type":"module"
// at the workspace root. Runtime code (src/) should continue to import from ./env.ts.
export default ({ config }: ConfigContext): MobileExpoConfig => ({
  ...config,
  name: readConfigValue('EXPO_PUBLIC_APP_DISPLAY_NAME', 'Mobile App Template'),
  slug: readConfigValue('EXPO_PUBLIC_APP_SLUG', 'mobile-app-template'),
  scheme: readConfigValue('EXPO_PUBLIC_APP_SCHEME', 'mobileapptemplate'),
  newArchEnabled: true,
  ios: { bundleIdentifier: readConfigValue('EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER', 'com.template.mobile') },
  android: { package: readConfigValue('EXPO_PUBLIC_ANDROID_PACKAGE', 'com.template.mobile') },
  plugins: ['expo-router'],
  extra: {
    apiUrl: readConfigUrl('EXPO_PUBLIC_API_URL', 'https://example.invalid'),
    eas: { projectId: process.env.EAS_PROJECT_ID },
  },
});
