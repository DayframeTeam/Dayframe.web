import { createEntityAdapter, createSlice, createSelector } from '@reduxjs/toolkit';
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

// Basic selectors
export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds,
  selectEntities: selectTaskEntities,
} = tasksAdapter.getSelectors((state: RootState) => state.tasks);

// Memoized selector for today's tasks
export const selectTodayTasks = createSelector(
  [selectAllTasks, (_, today: string) => today],
  (tasks, today) => tasks.filter((task) => !task.task_date || task.task_date === today)
);

// Memoized selector for task IDs by date
export const selectTaskIdsByDate = createSelector(
  [selectAllTasks, (_, date: string) => date],
  (tasks, date) =>
    tasks
      .filter((task) => !task.task_date || task.task_date === date)
      .map((task) => task.special_id)
);
