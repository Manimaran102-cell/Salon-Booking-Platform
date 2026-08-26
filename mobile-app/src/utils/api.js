import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://localhost:5000/api';

const API = axios.create({ baseURL: API_BASE });

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('glowup_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['glowup_token', 'glowup_user']);
    }
    return Promise.reject(error);
  }
);

export default API;
