import axios from 'axios';

<<<<<<< HEAD
const API = axios.create({ baseURL: 'https://salon-booking-platform.onrender.com/api' });
=======
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://salon-booking-platform.onrender.com/api';
const API = axios.create({ baseURL: API_BASE_URL });
>>>>>>> c6f6441cfc478c391f5a5a17fa55b5891762f2f7

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
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
