import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TemplateTask } from '../../types/dbTypes'; // адаптируй путь при необходимости

const initialState: TemplateTask[] = [];

const templateTasksSlice = createSlice({
  name: 'templateTasks',
  initialState,
  reducers: {
    setTemplateTasks(state, action: PayloadAction<TemplateTask[]>) {
      return action.payload;
    },
    addTemplateTask(state, action: PayloadAction<TemplateTask>) {
      state.push(action.payload);
    },
    updateTemplateTaskInState(state, action: PayloadAction<TemplateTask>) {
      const index = state.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    removeTemplateTask(state, action: PayloadAction<number>) {
      return state.filter((task) => task.id !== action.payload);
    },
  },
});

export const { setTemplateTasks, addTemplateTask, updateTemplateTaskInState, removeTemplateTask } =
  templateTasksSlice.actions;

export default templateTasksSlice.reducer;
