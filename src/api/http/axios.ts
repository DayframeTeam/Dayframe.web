import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// ⛔ Временно захардкожен user-id
api.defaults.headers.common['user-id'] = '1';

export default api;
