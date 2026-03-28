import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface IFacility {
  level: number;
}

interface IStadium extends IFacility {
  capacity: number;
}

interface IFacilities {
  stadium: IStadium;
  pitchSurface: IFacility;
  medicalCenter: IFacility;
  trainingGround: IFacility;
  fanShop: IFacility;
}

interface ClubState {
  currentClub: {
    id: string;
    name: string;
    abbreviation: string;
    cash: number;
    tokens: number;
    facilities: IFacilities;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ClubState = {
  currentClub: null,
  isLoading: false,
  error: null,
};

// ---- Async Thunks ----

export const fetchMyClub = createAsyncThunk(
  'club/fetchMyClub',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/clubs/mine');
      if (data.success) {
        // Map backend schema (cash) to frontend expectation (balance/cash)
        const club = data.data.club;
        return {
          id: club._id,
          name: club.name,
          abbreviation: club.abbreviation,
          cash: club.cash,
          tokens: club.tokens,
          facilities: club.facilities,
        };
      }
      return rejectWithValue('Club not found');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch club');
    }
  }
);

export const upgradeFacility = createAsyncThunk(
  'club/upgradeFacility',
  async (facility: string, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/clubs/facilities/upgrade', { facility });
      if (data.success) {
        return data.data; // { cash, facilities }
      }
      return rejectWithValue('Upgrade failed');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Upgrade failed');
    }
  }
);

const clubSlice = createSlice({
  name: 'club',
  initialState,
  reducers: {
    setClub(state, action: PayloadAction<ClubState['currentClub']>) {
      state.currentClub = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Club
    builder.addCase(fetchMyClub.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMyClub.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentClub = action.payload;
    });
    builder.addCase(fetchMyClub.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Upgrade Facility
    builder.addCase(upgradeFacility.fulfilled, (state, action) => {
      if (state.currentClub) {
        state.currentClub.cash = action.payload.cash;
        state.currentClub.facilities = action.payload.facilities;
      }
    });
  },
});

export const { setClub } = clubSlice.actions;
export default clubSlice.reducer;
