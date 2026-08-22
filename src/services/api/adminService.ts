import type { AdminStats } from '../../types';
import { INITIAL_ADMIN_STATS } from '../mockData';
import { apiClient } from './apiClient';

export const adminService = {
  async getAdminStats(): Promise<AdminStats> {
    return apiClient.get('/admin/stats', () => {
      return INITIAL_ADMIN_STATS;
    });
  }
};
