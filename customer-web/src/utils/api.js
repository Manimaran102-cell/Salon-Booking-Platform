import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://salon-booking-platform.onrender.com/api';
const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('glowup_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('glowup_token');
      localStorage.removeItem('glowup_user');
      window.dispatchEvent(new Event('glowup:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default API;
