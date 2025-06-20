import axios from 'axios';
import { selectAuthToken } from '../../entities/auth/store/authSlice';
import { store } from '../../store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:54401/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Каждый запрос автоматически получит нужный Authorization
api.interceptors.request.use((config) => {
  const token = selectAuthToken(store.getState());
  if (token) {
    config.headers!['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
export default api;
