import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('glowup_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('glowup_token', data.token);
    localStorage.setItem('glowup_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    localStorage.setItem('glowup_token', data.token);
    localStorage.setItem('glowup_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('glowup_token');
    localStorage.removeItem('glowup_user');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const { data } = await API.put('/auth/profile', updates);
    const updated = { ...user, ...data.user };
    localStorage.setItem('glowup_user', JSON.stringify(updated));
    setUser(updated);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
