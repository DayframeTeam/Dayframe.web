import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { Task } from '../../../types/dbTypes';
import type { RootState } from '../../../store';

const tasksAdapter = createEntityAdapter<Task, string>({
  selectId: (task) => task.special_id,
  sortComparer: (a, b) => (a.start_time || '').localeCompare(b.start_time || ''),
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState({
    isLoading: false,
    error: null as string | null,
  }),
  reducers: {
    setTasks: tasksAdapter.setAll,
    addTask: tasksAdapter.addOne,
    updateOneTask: tasksAdapter.updateOne,
    deleteTask: tasksAdapter.removeOne,
  },
});

export const { setTasks, addTask, updateOneTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds,
} = tasksAdapter.getSelectors((state: RootState) => state.tasks);
