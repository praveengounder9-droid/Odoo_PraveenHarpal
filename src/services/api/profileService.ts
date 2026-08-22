import type { User } from '../../types';
import { authService, getCurrentUserIdFromSession } from './authService';
import { apiClient } from './apiClient';

const STORAGE_KEY_USERS_DB = 'globetrotter_users_db';

function getUsersDB(): Record<string, User> {
  const str = localStorage.getItem(STORAGE_KEY_USERS_DB);
  if (!str) return {};
  return JSON.parse(str);
}

function saveUsersDB(db: Record<string, User>): void {
  localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(db));
}

export const profileService = {
  async getProfile(): Promise<User | null> {
    return authService.getCurrentUser();
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    return apiClient.put('/user/profile', updates, async () => {
      const currentUserId = getCurrentUserIdFromSession();
      if (!currentUserId) throw new Error('Unauthorized: Please log in first');

      const db = getUsersDB();
      const currentUser = db[currentUserId] || await authService.getCurrentUser();
      if (!currentUser) throw new Error('User not found');

      const updatedUser: User = {
        ...currentUser,
        ...updates,
        // Ensure preferences sub-object merges correctly
        preferences: {
          ...currentUser.preferences,
          ...(updates.preferences || {})
        }
      };

      db[currentUserId] = updatedUser;
      saveUsersDB(db);
      return updatedUser;
    });
  },

  async toggleSaveCity(cityId: string): Promise<User> {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) throw new Error('Unauthorized: Please log in first');

    const isSaved = currentUser.savedCityIds.includes(cityId);
    const newSaved = isSaved
      ? currentUser.savedCityIds.filter(id => id !== cityId)
      : [...currentUser.savedCityIds, cityId];

    return this.updateProfile({ savedCityIds: newSaved });
  }
};
