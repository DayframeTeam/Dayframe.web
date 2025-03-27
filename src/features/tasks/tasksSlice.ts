import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../../types/dbTypes';

const initialState: Task[] = [];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      return action.payload;
    },
    updateOneTask(state, action: PayloadAction<Task>) {
      const index = state.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteTask(state, action: PayloadAction<number>) {
      return state.filter((t) => t.id !== action.payload);
    },
    addTask(state, action: PayloadAction<Task>) {
      state.push(action.payload);
    },
  },
});

export const { setTasks, updateOneTask, deleteTask, addTask } = tasksSlice.actions;
export default tasksSlice.reducer;
