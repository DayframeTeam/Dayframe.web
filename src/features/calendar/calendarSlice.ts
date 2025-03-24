import { createSlice } from '@reduxjs/toolkit';
import type { CalendarEvent } from '../../types/dbTypes';
import { fetchCalendarEvents } from './calendarThunks';

interface CalendarState {
  list: CalendarEvent[];
  loading: boolean;
  error: string | null;
}

const initialState: CalendarState = {
  list: [],
  loading: false,
  error: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchCalendarEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки событий';
      });
  },
});

export default calendarSlice.reducer;
