import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import api from '../../services/api';
import type { IClub, IProfile } from '@footlaw/shared';

// ---- State ----

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  email: string | null;
  profileCompleted: boolean;
  profile: IProfile | null;
  club: IClub | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true, // true initially to check stored tokens
  userId: null,
  email: null,
  profileCompleted: false,
  profile: null,
  club: null,
  error: null,
};

// ---- Async Thunks ----

export const register = createAsyncThunk(
  'auth/register',
  async (
    { email, password, firstName, lastName, nationality }: 
    { email: string; password: string; firstName: string; lastName: string; nationality: string }, 
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post('/auth/register', { 
        email, 
        password, 
        firstName, 
        lastName, 
        nationality 
      });
      if (data.success) {
        await SecureStore.setItemAsync('accessToken', data.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', data.data.refreshToken);
        return data.data;
      }
      return rejectWithValue(data.error);
    } catch (error: any) {
      console.error('Registration error:', error?.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        'Registration failed'
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        await SecureStore.setItemAsync('accessToken', data.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', data.data.refreshToken);
        return data.data;
      }
      return rejectWithValue(data.error);
    } catch (error: any) {
      console.error('Login error:', error?.message || error);
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/google', { idToken });
      if (data.success) {
        await SecureStore.setItemAsync('accessToken', data.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', data.data.refreshToken);
        return data.data;
      }
      return rejectWithValue(data.error);
    } catch (error: any) {
      console.error('Google login error:', error?.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || 
        error.message || 
        'Google login failed'
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) return rejectWithValue('No token');

      const { data } = await api.get('/auth/me');
      if (data.success) return data.data;
      return rejectWithValue('Invalid token');
    } catch {
      return rejectWithValue('Auth check failed');
    }
  }
);

export const fetchMyClub = createAsyncThunk(
  'auth/fetchMyClub',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/clubs/mine');
      if (data.success) return data.data;
      return rejectWithValue('Club not found');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch club');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
});

// ---- Slice ----

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setProfileCompleted(state) {
      state.profileCompleted = true;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.profileCompleted = action.payload.profileCompleted;
      state.profile = action.payload.profile;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.profileCompleted = action.payload.profileCompleted;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Google Login
    builder.addCase(googleLogin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.profileCompleted = action.payload.profileCompleted;
    });
    builder.addCase(googleLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Check auth
    builder.addCase(checkAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.userId = action.payload._id;
      state.email = action.payload.email;
      state.profileCompleted = action.payload.profileCompleted;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
    });

    // Fetch club
    builder.addCase(fetchMyClub.fulfilled, (state, action) => {
      state.profile = action.payload.profile;
      state.club = action.payload.club;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      Object.assign(state, { ...initialState, isLoading: false });
    });
  },
});

export const { clearError, setProfileCompleted } = authSlice.actions;
export default authSlice.reducer;
