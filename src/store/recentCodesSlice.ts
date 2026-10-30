import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { GAS_WEBAPP_URL } from './itemsSlice';

export interface RecentCode {
  id: string;
  code: string;
}

interface RecentCodesState {
  codes: RecentCode[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RecentCodesState = {
  codes: [],
  isLoading: false,
  error: null,
};

export const fetchRecentCodes = createAsyncThunk('recentCodes/fetchRecentCodes', async () => {
  const response = await fetch(GAS_WEBAPP_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'getRecentCodes' }),
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
  });

  const data = await response.json();
  if (data.success) {
    return data.codes as RecentCode[];
  } else {
    throw new Error(data.error || 'Failed to fetch recent codes');
  }
});

const recentCodesSlice = createSlice({
  name: 'recentCodes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentCodes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentCodes.fulfilled, (state, action: PayloadAction<RecentCode[]>) => {
        state.isLoading = false;
        state.codes = action.payload;
      })
      .addCase(fetchRecentCodes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch recent codes';
      });
  },
});

export default recentCodesSlice.reducer;