import { createSlice } from '@reduxjs/toolkit';
import type { Plan } from '../../types/dbTypes';
import { addPlan, fetchPlans } from './plansThunks';

interface PlansState {
  list: Plan[];
  loading: boolean;
  error: string | null;
}

const initialState: PlansState = {
  list: [],
  loading: false,
  error: null,
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки планов';
      })
      .addCase(addPlan.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default plansSlice.reducer;
