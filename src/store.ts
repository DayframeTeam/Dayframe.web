import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './entities/task/store/tasksSlice';
import userReducer from './entities/user/store/userSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
