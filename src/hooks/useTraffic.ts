import { useQuery } from '@tanstack/react-query';
import { trafficApi } from '../api';
import type { TrafficResponse } from '../api/traffic/types';

// Query keys
export const trafficKeys = {
  all: ['traffic'] as const,
  lists: () => [...trafficKeys.all, 'list'] as const,
  list: (page: number, limit: number, tanggal?: string) =>
    [...trafficKeys.lists(), { page, limit, tanggal }] as const,
};

// Fetch all traffic data
export const useTraffic = (
  page: number = 1,
  limit: number = 20,
  tanggal?: string
) => {
  return useQuery<TrafficResponse, Error>({
    queryKey: trafficKeys.list(page, limit, tanggal),
    queryFn: () => trafficApi.fetchAll(page, limit, tanggal),
  });
};
