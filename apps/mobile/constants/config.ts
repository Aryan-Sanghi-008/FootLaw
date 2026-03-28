import Constants from 'expo-constants';

/**
 * Centered configuration for Google OAuth.
 * Replace these placeholders with your actual Client IDs from Google Cloud Console.
 */
export const GOOGLE_CONFIG = {
  androidClientId: 'your-android-client-id.apps.googleusercontent.com',
  iosClientId: 'your-ios-client-id.apps.googleusercontent.com',
  webClientId: 'your-web-client-id.apps.googleusercontent.com',
};

export const API_CONFIG = {
  // Uses dynamic host resolution for dev, or fallback to production URL
  baseUrl: __DEV__
    ? `http://${Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost'}:3001/api`
    : 'https://api.footlaw.app/api',
};
