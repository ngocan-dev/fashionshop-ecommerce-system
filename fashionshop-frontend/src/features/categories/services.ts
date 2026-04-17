import { api, apiRequest } from '@/lib/api/http';
import type { ApiResponse } from '@/lib/api/types';
import type { Category, UpsertCategoryRequest } from '@/types/category';

export async function fetchCategories() {
  const response = await api.get<ApiResponse<Category[]>>('/api/categories');
  return apiRequest(Promise.resolve(response));
}

export async function createCategory(request: UpsertCategoryRequest) {
  const response = await api.post<ApiResponse<Category>>('/api/categories', request);
  return apiRequest(Promise.resolve(response));
}
