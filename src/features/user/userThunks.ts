import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/http/axios';
import { User } from '../../types/dbTypes';
import { setUser } from './userSlice';

const url = '/users';

export const fetchUser = createAsyncThunk('user/fetch', async (_, thunkAPI) => {
  try {
    const res = await api.get<User>(`${url}/me`);
    thunkAPI.dispatch(setUser(res.data));
    return res.data;
  } catch (error) {
    console.error('Ошибка загрузки данных пользователя:', error);
    throw error;
  }
});
