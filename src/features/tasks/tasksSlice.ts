import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../../types/dbTypes';
import { fetchTasks } from './tasksThunks';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [] as Task[],
    isLoading: false,
    error: null as string | null,
  },
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    updateOneTask(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask(state, action: PayloadAction<number>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки данных';
      });
  },
});

export const { setTasks, updateOneTask, deleteTask, addTask } = tasksSlice.actions;
export default tasksSlice.reducer;
