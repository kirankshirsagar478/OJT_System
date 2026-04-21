import { create } from 'zustand';
import type { User, AuthResponse } from '../types';
import api from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true, // Start with loading true while checking token

  login: (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    window.location.href = '/login';
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }

      // Verify token with backend
      const res = await api.get('/auth/me');
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
