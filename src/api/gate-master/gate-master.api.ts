import { apiClient } from '../client';
import type {
  GateMasterResponse,
  GateMasterCreateRequest,
  GateMasterUpdateRequest,
} from './types';

export const gateMasterApi = {
  fetchAll: async (
    page: number = 1,
    limit: number = 10
  ): Promise<GateMasterResponse> => {
    const result: GateMasterResponse = await apiClient(
      `/gerbangs?page=${page}&limit=${limit}`,
      {
        requiresAuth: true,
      }
    );
    return result;
  },

  create: async (data: GateMasterCreateRequest): Promise<void> => {
    await apiClient('/gerbangs', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  update: async (data: GateMasterUpdateRequest): Promise<void> => {
    await apiClient('/gerbangs', {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  delete: async (id: number, IdCabang: number): Promise<void> => {
    await apiClient('/gerbangs', {
      method: 'DELETE',
      body: JSON.stringify({ id, IdCabang }),
      requiresAuth: true,
    });
  },
};
