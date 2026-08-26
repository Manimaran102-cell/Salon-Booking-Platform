import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('glowup_user').then(saved => {
      if (saved) setUser(JSON.parse(saved));
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    await AsyncStorage.setItem('glowup_token', data.token);
    await AsyncStorage.setItem('glowup_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    await AsyncStorage.setItem('glowup_token', data.token);
    await AsyncStorage.setItem('glowup_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['glowup_token', 'glowup_user']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
