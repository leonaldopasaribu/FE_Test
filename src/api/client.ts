import { API_BASE_URL } from './config';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const apiClient = async (
  endpoint: string,
  options: FetchOptions = {}
) => {
  const { requiresAuth = false, headers = {}, ...restOptions } = options;

  const token = localStorage.getItem('authToken');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(requiresAuth && token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Request failed',
    }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};
