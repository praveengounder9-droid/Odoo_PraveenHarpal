import type { Activity } from '../../types';
import { INITIAL_ACTIVITIES } from '../mockData';
import { apiClient } from './apiClient';

export const activitiesService = {
  async getActivities(cityId?: string, category?: string, searchQuery?: string): Promise<Activity[]> {
    return apiClient.get('/activities', () => {
      let result = [...INITIAL_ACTIVITIES];
      if (cityId) {
        result = result.filter(a => a.cityId === cityId);
      }
      if (category && category !== 'All') {
        result = result.filter(a => a.category === category);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(a => 
          a.name.toLowerCase().includes(q) || 
          a.cityName.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
        );
      }
      return result;
    });
  },

  async getActivityById(id: string): Promise<Activity | null> {
    return apiClient.get(`/activities/${id}`, () => {
      return INITIAL_ACTIVITIES.find(a => a.id === id) || null;
    });
  }
};
