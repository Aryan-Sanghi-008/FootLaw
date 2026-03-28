import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// ---- Resolve Local Host Dynamically ----
// This is the most reliable way to connect to your local dev server from Expo Go
const getBaseUrl = () => {
  // Priority 1: Environment Variable (Production or Manual Override)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Priority 2: Dynamic Local Host (Dev mode only)
  if (__DEV__) {
    // Metro hostUri looks like: 192.168.1.4:8081
    const host = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
    const url = `http://${host}:3001/api`;
    console.log('🔗 API Base URL (Dynamic):', url);
    return url;
  }

  // Fallback for production if no env var is set
  return 'https://api.footlaw.app/api';
};

const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ---- Request interceptor: attach access token ----

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response interceptor: auto-refresh token ----

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });

        if (data.success) {
          await SecureStore.setItemAsync('accessToken', data.data.accessToken);
          await SecureStore.setItemAsync('refreshToken', data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        // Refresh failed — clear tokens and let the app handle the redirect
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
