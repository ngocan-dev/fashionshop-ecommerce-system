import axios from 'axios';
import { clearStoredSession, getStoredToken } from '@/lib/auth/storage';
import { parseApiError } from './errors';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const payload = response.data;
    if (payload && typeof payload === 'object' && 'success' in payload && payload.success === false) {
      throw new Error(payload.message || 'Request failed');
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearStoredSession();
      if (typeof window !== 'undefined') {
        window.location.assign('/login');
      }
    }
    if (status === 403 && typeof window !== 'undefined') {
      window.location.assign('/forbidden');
    }
    return Promise.reject(parseApiError(error));
  },
);

export async function apiRequest<T>(promise: Promise<{ data: { success: boolean; message: string; data: T } }>): Promise<T> {
  const response = await promise;
  if (!response.data.success) {
    throw new Error(response.data.message || 'Request failed');
  }
  return response.data.data;
}
