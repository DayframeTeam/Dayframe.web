import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/http/axios';
import type { Plan } from '../../types/dbTypes';

export const fetchPlans = createAsyncThunk<Plan[], number>(
  'plans/fetchPlans',
  async (userId) => {
    const response = await api.get<Plan[]>(`/plans/${userId}`);
    return response.data;
  }
);

// Тип данных для добавления (без id, created_at, и с user_id)
type NewPlan = Omit<Plan, 'id' | 'created_at'>;

export const addPlan = createAsyncThunk<Plan, NewPlan>(
  'plans/addPlan',
  async (newPlan) => {
    const response = await api.post<Plan>('/plans', newPlan);
    return response.data;
  }
);