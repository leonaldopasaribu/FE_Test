import { apiClient } from '../client';
import type { TrafficResponse } from './types';

export const trafficApi = {
  fetchAll: async (
    page: number = 1,
    limit: number = 20,
    tanggal?: string
  ): Promise<TrafficResponse> => {
    let url = `/lalins?page=${page}&limit=${limit}`;
    if (tanggal && tanggal.trim() !== '') {
      url += `&tanggal=${encodeURIComponent(tanggal)}`;
    }
    const result: TrafficResponse = await apiClient(url, {
      requiresAuth: true,
    });
    return result;
  },
};
