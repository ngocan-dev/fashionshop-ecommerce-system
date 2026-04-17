import { api, apiRequest } from '@/lib/api/http';
import type { ApiResponse } from '@/lib/api/types';
import type { HomePayload } from '@/types/home';

export async function fetchHome() {
  const response = await api.get<ApiResponse<HomePayload>>('/api/home');
  return apiRequest(Promise.resolve(response));
}
