import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './features/tasks/tasksSlice';
import templateTasksReducer from './features/templateTasks/templateTasksSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    templateTasks: templateTasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
