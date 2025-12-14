'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { api, User } from './api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string, name?: string) => Promise<string | null>;
  logout: () => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });
  const initialized = useRef(false);

  const fetchUser = useCallback(async (token: string) => {
    const { data, error } = await api.getMe(token);
    if (error || !data) {
      localStorage.removeItem(TOKEN_KEY);
      setState({ user: null, token: null, isLoading: false });
      return;
    }
    setState({ user: data, token, isLoading: false });
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetchUser(token);
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, [fetchUser]);

  const login = async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await api.login(email, password);
    if (error || !data) return error || 'Login failed';

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    setState({ user: data.user, token: data.accessToken, isLoading: false });
    return null;
  };

  const register = async (
    email: string,
    password: string,
    name?: string,
  ): Promise<string | null> => {
    const { data, error } = await api.register(email, password, name);
    if (error || !data) return error || 'Registration failed';

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    setState({ user: data.user, token: data.accessToken, isLoading: false });
    return null;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ user: null, token: null, isLoading: false });
  };

  const setToken = useCallback(
    (token: string) => {
      if (state.token === token) return;
      localStorage.setItem(TOKEN_KEY, token);
      fetchUser(token);
    },
    [state.token, fetchUser],
  );

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
