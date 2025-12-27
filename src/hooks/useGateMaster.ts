import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gateMasterApi } from '../api';
import type {
  GateMasterResponse,
  GateMasterCreateRequest,
  GateMasterUpdateRequest,
} from '../api/gate-master/types';

// Query keys
export const gateMasterKeys = {
  all: ['gateMaster'] as const,
  lists: () => [...gateMasterKeys.all, 'list'] as const,
  list: (page: number, limit: number, searchQuery?: string) =>
    [...gateMasterKeys.lists(), { page, limit, searchQuery }] as const,
};

// Fetch all gate masters
export const useGateMasters = (
  page: number = 1,
  limit: number = 10,
  searchQuery?: string
) => {
  return useQuery<GateMasterResponse, Error>({
    queryKey: gateMasterKeys.list(page, limit, searchQuery),
    queryFn: () => gateMasterApi.fetchAll(page, limit, searchQuery),
  });
};

// Create gate master
export const useCreateGateMaster = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, GateMasterCreateRequest>({
    mutationFn: (data: GateMasterCreateRequest) => gateMasterApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch gate master queries
      queryClient.invalidateQueries({ queryKey: gateMasterKeys.lists() });
    },
  });
};

// Update gate master
export const useUpdateGateMaster = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, GateMasterUpdateRequest>({
    mutationFn: (data: GateMasterUpdateRequest) => gateMasterApi.update(data),
    onSuccess: () => {
      // Invalidate and refetch gate master queries
      queryClient.invalidateQueries({ queryKey: gateMasterKeys.lists() });
    },
  });
};

// Delete gate master
export const useDeleteGateMaster = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; IdCabang: number }>({
    mutationFn: ({ id, IdCabang }) => gateMasterApi.delete(id, IdCabang),
    onSuccess: () => {
      // Invalidate and refetch gate master queries
      queryClient.invalidateQueries({ queryKey: gateMasterKeys.lists() });
    },
  });
};
