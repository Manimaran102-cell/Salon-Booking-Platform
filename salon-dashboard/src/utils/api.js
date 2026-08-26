import axios from 'axios';
const API = axios.create({ baseURL: '/api' });
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('glowup_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
API.interceptors.response.use((r) => r, (err) => {
  if (err.response?.status === 401) { localStorage.clear(); window.location.href = '/login'; }
  return Promise.reject(err);
});
export default API;
