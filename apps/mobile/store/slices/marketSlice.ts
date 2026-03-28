import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface IAuction {
  _id: string;
  playerId: {
    _id: string;
    firstName: string;
    lastName: string;
    age: number;
    position: string;
    starRating: number;
    stats: any;
    condition: number;
    morale: string;
  };
  startPrice: number;
  currentBid: number;
  highestBidderId: string | null;
  endTime: string;
  status: string;
  bids: any[];
}

interface MarketState {
  liveAuctions: IAuction[];
  eliteScouts: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  liveAuctions: [],
  eliteScouts: [],
  isLoading: false,
  error: null,
};

// ---- Async Thunks ----

export const fetchLiveAuctions = createAsyncThunk(
  'market/fetchLiveAuctions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/market/auctions/live');
      if (data.success) return data.data;
      return rejectWithValue('Failed to fetch auctions');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load market');
    }
  }
);

export const placeBid = createAsyncThunk(
  'market/placeBid',
  async ({ auctionId, amount }: { auctionId: string; amount: number }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/market/auctions/${auctionId}/bid`, { amount });
      if (data.success) return data.data;
      return rejectWithValue('Bid failed');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Bid failed');
    }
  }
);

export const fetchEliteScouts = createAsyncThunk(
  'market/fetchEliteScouts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/market/scouts/elite');
      if (data.success) return data.data;
      return rejectWithValue('Failed to fetch scouts');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load scouts');
    }
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Live Auctions
    builder.addCase(fetchLiveAuctions.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLiveAuctions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.liveAuctions = action.payload;
    });
    builder.addCase(fetchLiveAuctions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Place Bid
    builder.addCase(placeBid.fulfilled, (state, action) => {
      const idx = state.liveAuctions.findIndex(a => a._id === action.payload._id);
      if (idx !== -1) {
        state.liveAuctions[idx] = action.payload;
      }
    });

    // Elite Scouts
    builder.addCase(fetchEliteScouts.fulfilled, (state, action) => {
      state.eliteScouts = action.payload;
    });
  },
});

export default marketSlice.reducer;
