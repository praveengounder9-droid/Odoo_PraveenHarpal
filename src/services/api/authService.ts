import type { User } from '../../types';
import { INITIAL_USER } from '../mockData';
import { apiClient } from './apiClient';

const STORAGE_KEY_USERS_DB = 'globetrotter_users_db';
const STORAGE_KEY_SESSION_USER_ID = 'globetrotter_session_user_id';

// Pre-seeded isolated test users
export const PRESEEDED_USERS: Record<string, User> = {
  'usr-rahul': {
    id: 'usr-rahul',
    name: 'Rahul Kumar',
    email: 'rahul@globetrotter.io',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Luxury travel enthusiast, coffee aficionado, exploring European architecture.',
    role: 'user',
    preferences: {
      currency: 'USD',
      language: 'English',
      theme: 'light',
    },
    savedCityIds: ['cty-paris', 'cty-rome'],
  },
  'usr-priya': {
    id: 'usr-priya',
    name: 'Priya Sharma',
    email: 'priya@globetrotter.io',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Photographer and adventure seeker wandering across Asia.',
    role: 'user',
    preferences: {
      currency: 'USD',
      language: 'English',
      theme: 'light',
    },
    savedCityIds: ['cty-tokyo', 'cty-bali'],
  }
};

function getUsersDB(): Record<string, User> {
  const str = localStorage.getItem(STORAGE_KEY_USERS_DB);
  if (!str) {
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(PRESEEDED_USERS));
    return PRESEEDED_USERS;
  }
  return JSON.parse(str);
}

function saveUsersDB(db: Record<string, User>): void {
  localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(db));
}

export function getCurrentUserIdFromSession(): string {
  const currentId = localStorage.getItem(STORAGE_KEY_SESSION_USER_ID);
  if (currentId) return currentId;
  // Default to Rahul if no session set
  localStorage.setItem(STORAGE_KEY_SESSION_USER_ID, 'usr-rahul');
  return 'usr-rahul';
}

export const authService = {
  async login(email: string, _password: string): Promise<User> {
    return apiClient.post('/auth/login', { email }, () => {
      const db = getUsersDB();
      // Search for user by email
      let found = Object.values(db).find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!found) {
        // Create new user entry dynamically
        const newId = `usr-${Date.now()}`;
        const nameFromEmail = email.split('@')[0].replace('.', ' ');
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        found = {
          ...INITIAL_USER,
          id: newId,
          name: formattedName,
          email: email,
        };
        db[newId] = found;
        saveUsersDB(db);
      }

      localStorage.setItem(STORAGE_KEY_SESSION_USER_ID, found.id);
      localStorage.setItem('globetrotter_token', `mock-jwt-token-${found.id}`);
      return found;
    });
  },

  async signup(name: string, email: string, _password: string): Promise<User> {
    return apiClient.post('/auth/signup', { name, email }, () => {
      const db = getUsersDB();
      const newId = `usr-${Date.now()}`;
      const newUser: User = {
        ...INITIAL_USER,
        id: newId,
        name,
        email,
      };
      db[newId] = newUser;
      saveUsersDB(db);

      localStorage.setItem(STORAGE_KEY_SESSION_USER_ID, newId);
      localStorage.setItem('globetrotter_token', `mock-jwt-token-${newId}`);
      return newUser;
    });
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get('/auth/me', () => {
      const db = getUsersDB();
      const currentId = getCurrentUserIdFromSession();
      const user = db[currentId];
      if (user) return user;
      
      // Fallback
      return db['usr-rahul'] || PRESEEDED_USERS['usr-rahul'];
    });
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_SESSION_USER_ID);
    localStorage.removeItem('globetrotter_token');
  }
};
