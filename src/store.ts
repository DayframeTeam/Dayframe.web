import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './features/tasks/tasksSlice';
import plansReducer from './features/plans/plansSlice';
import calendarReducer from './features/calendar/calendarSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    plans: plansReducer,
    calendar: calendarReducer,
  },
});

// ✅ Вот здесь:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
