import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../../types/dbTypes'; // путь адаптируй под себя

const initialState: Task[] = [];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      return action.payload;
    },
    addTask(state, action: PayloadAction<Task>) {
      state.push(action.payload);
    },
    updateTaskInState(state, action: PayloadAction<Task>) {
      const index = state.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    removeTask(state, action: PayloadAction<number>) {
      return state.filter((task) => task.id !== action.payload);
    },
  },
});

export const { setTasks, addTask, updateTaskInState, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer;
