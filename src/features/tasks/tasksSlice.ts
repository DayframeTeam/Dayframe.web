import { createSlice } from '@reduxjs/toolkit';
import type { Task } from '../../types/dbTypes';
import { fetchTasks } from './tasksThunks';

interface TasksState {
  list: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  list: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.list.push(action.payload);
    },
    removeTask: (state, action) => {
      state.list = state.list.filter((task) => task.id !== action.payload);
    },
    clearTasks: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки задач';
      });
  },
});

export const { addTask, removeTask, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
