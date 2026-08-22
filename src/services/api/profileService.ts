import type { User } from '../../types';
import { authService } from './authService';
import { apiClient } from './apiClient';

export const profileService = {
  async getProfile(): Promise<User> {
    return authService.getCurrentUser();
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    return apiClient.put('/user/profile', updates, async () => {
      const currentUser = await authService.getCurrentUser();
      const updated = { ...currentUser, ...updates };
      localStorage.setItem('globetrotter_user', JSON.stringify(updated));
      return updated;
    });
  },

  async toggleSaveCity(cityId: string): Promise<User> {
    const currentUser = await authService.getCurrentUser();
    const isSaved = currentUser.savedCityIds.includes(cityId);
    const newSaved = isSaved 
      ? currentUser.savedCityIds.filter(id => id !== cityId)
      : [...currentUser.savedCityIds, cityId];

    return this.updateProfile({ savedCityIds: newSaved });
  }
};
