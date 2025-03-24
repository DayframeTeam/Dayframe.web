import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CalendarEvent } from '../../types/dbTypes'; // твой тип

export const fetchCalendarEvents = createAsyncThunk(
  'calendar/fetchCalendarEvents',
  async (userId: number) => {
    const res = await axios.get<CalendarEvent[]>(`/api/calendar/user/${userId}`);
    return res.data;
  }
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: [] as CalendarEvent[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCalendarEvents.fulfilled, (_, action) => action.payload);
  },
});

export default calendarSlice.reducer;
