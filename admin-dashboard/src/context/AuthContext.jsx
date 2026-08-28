import { createContext, useContext, useEffect, useState } from 'react';
import API from '../utils/api';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('glowup_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setLoading(false);
      return;
    }

    localStorage.setItem('glowup_token', token);
    params.delete('token');
    window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`);
    API.get('/auth/me')
      .then(({ data }) => {
        localStorage.setItem('glowup_user', JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {
        localStorage.clear();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);
  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('glowup_token', data.token);
    localStorage.setItem('glowup_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };
  const logout = () => { localStorage.clear(); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
