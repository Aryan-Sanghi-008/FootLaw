import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { IPlayer } from '@footlaw/shared';

interface SquadState {
  players: IPlayer[];
  selectedPlayer: IPlayer | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SquadState = {
  players: [],
  selectedPlayer: null,
  isLoading: false,
  error: null,
};

export const fetchSquad = createAsyncThunk(
  'squad/fetchSquad',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/players/squad');
      if (data.success) return data.data.players;
      return rejectWithValue('Failed to load squad');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load squad');
    }
  }
);

export const fetchPlayerDetail = createAsyncThunk(
  'squad/fetchPlayerDetail',
  async (playerId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/players/${playerId}`);
      if (data.success) return data.data;
      return rejectWithValue('Player not found');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load player');
    }
  }
);

const squadSlice = createSlice({
  name: 'squad',
  initialState,
  reducers: {
    clearSelectedPlayer(state) {
      state.selectedPlayer = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSquad.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSquad.fulfilled, (state, action) => {
      state.isLoading = false;
      state.players = action.payload;
    });
    builder.addCase(fetchSquad.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchPlayerDetail.fulfilled, (state, action) => {
      state.selectedPlayer = action.payload;
    });
  },
});

export const { clearSelectedPlayer } = squadSlice.actions;
export default squadSlice.reducer;
