import type { AxiosError } from 'axios';

export type ParsedApiError = {
  message: string;
  status?: number;
  code?: string;
};

export function parseApiError(error: unknown): ParsedApiError {
  if (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
    const axiosError = error as AxiosError<{ success?: boolean; message?: string }>;
    const status = axiosError.response?.status;
    const responseMessage = axiosError.response?.data?.message;
    return {
      message: responseMessage || axiosError.message || 'An unexpected error occurred',
      status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'An unexpected error occurred' };
}
