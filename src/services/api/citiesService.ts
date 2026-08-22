import type { City } from '../../types';
import { INITIAL_CITIES } from '../mockData';
import { apiClient } from './apiClient';

export const citiesService = {
  async getCities(searchQuery?: string, region?: string, country?: string): Promise<City[]> {
    return apiClient.get('/cities', () => {
      let result = [...INITIAL_CITIES];
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(c => 
          c.name.toLowerCase().includes(q) || 
          c.country.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      if (region && region !== 'All') {
        result = result.filter(c => c.region === region);
      }
      if (country && country !== 'All') {
        result = result.filter(c => c.country === country);
      }
      return result;
    });
  },

  async getCityById(id: string): Promise<City | null> {
    return apiClient.get(`/cities/${id}`, () => {
      return INITIAL_CITIES.find(c => c.id === id) || null;
    });
  }
};
