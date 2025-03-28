import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../../types/dbTypes';
import { fetchTasks } from './tasksThunks';

type TasksState = {
  tasks: Task[];
  isLoading: boolean;
};

const initialState: TasksState = {
  tasks: [],
  isLoading: false,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
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
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setTasks, updateOneTask, deleteTask, addTask } = tasksSlice.actions;
export default tasksSlice.reducer;
