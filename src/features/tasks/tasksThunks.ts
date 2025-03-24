import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Task } from '../../types/dbTypes';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId: number): Promise<Task[]> => {
    const res = await axios.get<Task[]>(`/api/tasks/user/${userId}`);
    return res.data;
  }
);
