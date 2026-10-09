import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('jobtrackr_token'));
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async (tok) => {
    try {
      const res = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${tok}` },
      });
      setUser(res.data.user);
    } catch {
      localStorage.removeItem('jobtrackr_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('jobtrackr_token');
    if (saved) {
      fetchMe(saved);
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token: tok, user: u } = res.data;
    localStorage.setItem('jobtrackr_token', tok);
    setToken(tok);
    setUser(u);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    const { token: tok, user: u } = res.data;
    localStorage.setItem('jobtrackr_token', tok);
    setToken(tok);
    setUser(u);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('jobtrackr_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
