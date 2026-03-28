import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface IMatchEvent {
  minute: number;
  type: string;
  clubId: string;
  text: string;
}

interface IMatch {
  _id: string;
  homeClubId: string;
  awayClubId: string;
  homeScore: number;
  awayScore: number;
  status: string;
  competition: string;
  date: string;
  events: IMatchEvent[];
  stats: any;
}

interface MatchState {
  nextMatch: IMatch | null;
  activeSimulation: IMatch | null;
  isLoading: boolean;
  isSimulating: boolean;
  error: string | null;
}

const initialState: MatchState = {
  nextMatch: null,
  activeSimulation: null,
  isLoading: false,
  isSimulating: false,
  error: null,
};

// ---- Async Thunks ----

export const fetchNextMatch = createAsyncThunk(
  'match/fetchNextMatch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/matches/next');
      if (data.success) return data.data;
      return rejectWithValue('No upcoming match');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch match');
    }
  }
);

export const simulateMatch = createAsyncThunk(
  'match/simulateMatch',
  async (matchId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/matches/${matchId}/simulate`);
      if (data.success) return data.data;
      return rejectWithValue('Simulation failed');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Simulation failed');
    }
  }
);

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    clearSimulation(state) {
      state.activeSimulation = null;
      state.isSimulating = false;
    },
  },
  extraReducers: (builder) => {
    // Next Match
    builder.addCase(fetchNextMatch.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchNextMatch.fulfilled, (state, action) => {
      state.isLoading = false;
      state.nextMatch = action.payload;
    });
    builder.addCase(fetchNextMatch.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Simulate Match
    builder.addCase(simulateMatch.pending, (state) => {
      state.isSimulating = true;
      state.error = null;
    });
    builder.addCase(simulateMatch.fulfilled, (state, action) => {
      state.isSimulating = false;
      state.activeSimulation = action.payload;
      state.nextMatch = null; // Clear next match since it's now completed
    });
    builder.addCase(simulateMatch.rejected, (state, action) => {
      state.isSimulating = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSimulation } = matchSlice.actions;
export default matchSlice.reducer;
