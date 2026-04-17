import type { ApiListResponse } from './types';

export function toArray<T>(data: T[] | ApiListResponse<T> | undefined | null): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}
