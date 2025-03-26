import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/http/axios';
import { TemplateTask } from '../../types/dbTypes';
import {
  addTemplateTask,
  removeTemplateTask,
  setTemplateTasks,
  updateTemplateTaskInState,
} from './templateTasksSlice';

const url = '/templateTasks';

// Общий обработчик ошибок
const handleError = (error: unknown, message: string, thunkAPI: any) => {
  console.error(message, error);
  return thunkAPI.rejectWithValue(message);
};

// 🔄 Загрузка всех шаблонов задач
export const fetchTemplateTasks = createAsyncThunk(
  'templateTasks/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get<TemplateTask[]>(url);
      thunkAPI.dispatch(setTemplateTasks(res.data));
      console.log('templateTasks', res.data);
      return res.data;
    } catch (error) {
      return handleError(error, 'Ошибка загрузки шаблонов задач', thunkAPI);
    }
  }
);

// ➕ Добавление шаблона
export const createTemplateTask = createAsyncThunk(
  'templateTasks/create',
  async (taskData: Partial<TemplateTask>, thunkAPI) => {
    try {
      const res = await api.post<TemplateTask>(url, taskData);
      thunkAPI.dispatch(addTemplateTask(res.data));
      return res.data;
    } catch (error) {
      return handleError(error, 'Ошибка создания шаблона', thunkAPI);
    }
  }
);

// ✏️ Обновление шаблона
export const updateTemplateTask = createAsyncThunk(
  'templateTasks/update',
  async ({ id, data }: { id: number; data: Partial<TemplateTask> }, thunkAPI) => {
    try {
      const res = await api.patch<TemplateTask>(`${url}/${id}`, data);
      thunkAPI.dispatch(updateTemplateTaskInState(res.data));
      return res.data;
    } catch (error) {
      return handleError(error, 'Ошибка обновления шаблона', thunkAPI);
    }
  }
);

// 🗑 Удаление шаблона
export const deleteTemplateTask = createAsyncThunk(
  'templateTasks/delete',
  async (id: number, thunkAPI) => {
    try {
      await api.delete(`${url}/${id}`);
      thunkAPI.dispatch(removeTemplateTask(id));
    } catch (error) {
      return handleError(error, 'Ошибка удаления шаблона', thunkAPI);
    }
  }
);
