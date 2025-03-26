import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/http/axios';
import type { CalendarEvent } from '../../types/dbTypes';

export const fetchCalendarEvents = createAsyncThunk<CalendarEvent[], number>(
  'calendar/fetchCalendarEvents',
  async (userId) => {
    const response = await api.get<CalendarEvent[]>(`/calendar/${userId}`);
    return response.data;
  }
);

type NewCalendarEvent = Omit<CalendarEvent, 'id' | 'created_at'>;

export const addCalendarEvent = createAsyncThunk<CalendarEvent, NewCalendarEvent>(
  'calendar/addCalendarEvent',
  async (event) => {
    const response = await api.post<CalendarEvent>('/calendar', event);
    return response.data;
  }
);

export const updateCalendarEventStatus = createAsyncThunk<
  { id: number; status: 'done' | 'planned' },
  { eventId: number; status: 'done' | 'planned' }
>('calendar/updateStatus', async ({ eventId, status }) => {
  await api.patch(`/calendar/status/${eventId}`, { status });
  return { id: eventId, status };
});
