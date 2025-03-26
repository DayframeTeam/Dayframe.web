import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/http/axios';
import { Task } from '../../types/dbTypes';
import { addTask, removeTask, setTasks, updateTaskInState } from './tasksSlice';

const url = '/tasks';

// Общий обработчик ошибок
const handleError = (error: unknown, message: string, thunkAPI: any) => {
  console.error(message, error);
  return thunkAPI.rejectWithValue(message);
};

// Подгрузка задач
export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await api.get<Task[]>(url);
    thunkAPI.dispatch(setTasks(res.data));
    console.log('fetchTasks', res.data);
    return res.data;
  } catch (error) {
    return handleError(error, 'Ошибка загрузки задач', thunkAPI);
  }
});

// Добавление задачи
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData: Partial<Task>, thunkAPI) => {
    try {
      const res = await api.post<Task>(url, taskData);
      thunkAPI.dispatch(addTask(res.data));
      return res.data;
    } catch (error) {
      return handleError(error, 'Ошибка создания задачи', thunkAPI);
    }
  }
);

// Обновление задачи
export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }: { id: number; data: Partial<Task> }, thunkAPI) => {
    try {
      const res = await api.patch<Task>(`${url}/${id}`, data);
      thunkAPI.dispatch(updateTaskInState(res.data));
      return res.data;
    } catch (error) {
      return handleError(error, 'Ошибка обновления задачи', thunkAPI);
    }
  }
);

// Удаление задачи
export const deleteTask = createAsyncThunk('tasks/delete', async (id: number, thunkAPI) => {
  try {
    await api.delete(`${url}/${id}`);
    thunkAPI.dispatch(removeTask(id));
  } catch (error) {
    return handleError(error, 'Ошибка удаления задачи', thunkAPI);
  }
});
