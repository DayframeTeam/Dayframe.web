import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/http/axios';
import { Task } from '../../types/dbTypes';
import { updateOneTask } from '../tasks/tasksSlice';

const url = '/subtasks';

const handleError = (error: unknown, message: string, thunkAPI: any) => {
  console.error(message, error);
  return thunkAPI.rejectWithValue(message);
};

export const updateSubtaskStatus = createAsyncThunk(
  'subtasks/updateStatus',
  async ({ id, is_done }: { id: number; is_done: boolean }, thunkAPI) => {
    return api
      .patch<Task>(`${url}/is_done/${id}`, { is_done })
      .then((res) => {
        thunkAPI.dispatch(updateOneTask(res.data));
        return res.data;
      })
      .catch((error) => handleError(error, 'Ошибка обновления подзадачи', thunkAPI));
  }
);
