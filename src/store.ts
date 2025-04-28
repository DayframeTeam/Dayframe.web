import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './entities/task/store/tasksSlice';
import userReducer from './entities/user/store/userSlice';
import templateTasksReducer from './entities/template-tasks/store/templateTasksSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer,
    templateTasks: templateTasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
