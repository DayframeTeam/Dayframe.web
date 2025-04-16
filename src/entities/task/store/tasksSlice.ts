import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../../../types/dbTypes';

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
        const updatedTask = {
          ...action.payload,
          subtasks: [...(action.payload.subtasks || [])].sort((a, b) => a.position - b.position),
        };
        state.tasks[index] = updatedTask;
      }
    },
    deleteTask(state, action: PayloadAction<number>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
  }
});

export const { setTasks, updateOneTask, deleteTask, addTask } = tasksSlice.actions;
export default tasksSlice.reducer;
