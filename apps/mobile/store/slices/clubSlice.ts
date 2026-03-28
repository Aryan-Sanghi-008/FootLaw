import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClubState {
  currentClub: {
    id: string;
    name: string;
    balance: number;
    tokens: number;
  } | null;
  isLoading: boolean;
}

const initialState: ClubState = {
  // Mock initial state for Top Eleven UI Dashboard
  currentClub: {
    id: '1',
    name: 'London FC',
    balance: 5400000,
    tokens: 120,
  },
  isLoading: false,
};

const clubSlice = createSlice({
  name: 'club',
  initialState,
  reducers: {
    setClub(state, action: PayloadAction<ClubState['currentClub']>) {
      state.currentClub = action.payload;
    },
  },
});

export const { setClub } = clubSlice.actions;
export default clubSlice.reducer;
