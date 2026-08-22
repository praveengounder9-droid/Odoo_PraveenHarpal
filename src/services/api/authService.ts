import type { User } from '../../types';
import { INITIAL_USER } from '../mockData';
import { apiClient } from './apiClient';

const STORAGE_KEY_USER = 'globetrotter_user';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    return apiClient.post('/auth/login', { email, password }, () => {
      const storedUserStr = localStorage.getItem(STORAGE_KEY_USER);
      let user = storedUserStr ? JSON.parse(storedUserStr) : INITIAL_USER;
      user.email = email;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem('globetrotter_token', 'mock-jwt-token-12345');
      return user;
    });
  },

  async signup(name: string, email: string, password: string): Promise<User> {
    return apiClient.post('/auth/signup', { name, email, password }, () => {
      const newUser: User = {
        ...INITIAL_USER,
        id: `usr-${Date.now()}`,
        name,
        email,
      };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      localStorage.setItem('globetrotter_token', `mock-jwt-${Date.now()}`);
      return newUser;
    });
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get('/auth/me', () => {
      const storedUserStr = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUserStr) {
        return JSON.parse(storedUserStr);
      }
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    });
  },

  async logout(): Promise<void> {
    localStorage.removeItem('globetrotter_token');
  }
};
