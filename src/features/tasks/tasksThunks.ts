import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/http/axios';
import { Task } from '../../types/dbTypes';
import { setTasks, updateOneTask, deleteTask as removeTask, addTask } from './tasksSlice';
import { TaskLocal, TemplateTaskLocal } from '../../components/EditTaskModal/EditTaskModal';

const url = '/tasks';

const handleError = (error: unknown, message: string, thunkAPI: any) => {
  console.error(message, error);
  return thunkAPI.rejectWithValue(message);
};

// Получение всех задач с подзадачами
export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await api.get<Task[]>(url);
    thunkAPI.dispatch(setTasks(res.data));
    return res.data;
  } catch (error) {
    return handleError(error, 'Ошибка загрузки задач', thunkAPI);
  }
});

// Обновить статус is_done
export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  ({ id, is_done }: { id: number; is_done: boolean }, thunkAPI) => {
    return api
      .patch<Task>(`${url}/is_done/${id}`, { is_done })
      .then((res) => {
        thunkAPI.dispatch(updateOneTask(res.data));
        return res.data;
      })
      .catch((err) => handleError(err, 'Ошибка обновления статуса задачи', thunkAPI));
  }
);

// Обновить всю задачу
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  ({ id, data }: { id: number; data: TaskLocal | TemplateTaskLocal }, thunkAPI) => {
    // Нормализуем данные перед отправкой на сервер
    const normalizedData = {
      ...data,
      subtasks: data.subtasks
        .filter((s) => !s.is_deleted)
        .map(({ uniqueKey, is_deleted, ...rest }) => rest)
        .map((subtask, index) => ({
          ...subtask,
          position: index,
        })),
    };

    return api
      .patch<Task>(`${url}/${id}`, normalizedData)
      .then((res) => {
        // Обновляем store только после успешного ответа от сервера
        thunkAPI.dispatch(updateOneTask(res.data));
        return res.data;
      })
      .catch((err) => handleError(err, 'Ошибка обновления задачи', thunkAPI));
  }
);

// Создание новой задачи
export const createTask = createAsyncThunk(
  'tasks/createTask',
  (task: Omit<Task, 'id' | 'created_at'>, thunkAPI) => {
    return api
      .post<Task>(url, task)
      .then((res) => {
        thunkAPI.dispatch(addTask(res.data));
        return res.data;
      })
      .catch((err) => handleError(err, 'Ошибка создания задачи', thunkAPI));
  }
);
