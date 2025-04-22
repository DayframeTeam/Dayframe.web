import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../../types/dbTypes';
import { RootState } from '../../../store';

// state будет именно map: ключ — это Task.special_id, значение — весь Task
type TasksState = Record<string, Task>;

const initialTasksState: TasksState = {};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialTasksState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      return action.payload.reduce<TasksState>((map, task) => {
        map[task.special_id] = task;
        return map;
      }, {});
    },
    addTask(state, action: PayloadAction<Task>) {
      state[action.payload.special_id] = action.payload;
    },
    deleteTask(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
    updateTask(state, action: PayloadAction<Task>) {
      state[action.payload.special_id] = action.payload;
    },
  },
});

export const { setTasks, addTask, deleteTask, updateTask } = tasksSlice.actions;

export default tasksSlice.reducer;

// -------------------------------------
// Селекторы
// -------------------------------------

export const selectAllTasks = (state: RootState) => state.tasks;

// Параметризованный селектор: отбирает по special_id
export const selectTaskBySpecialId = (state: RootState, special_id: string) => state.tasks[special_id];

// Получить все special_id из tasks
export const selectAllTaskSpecialIds = (state: RootState) => Object.keys(state.tasks);
