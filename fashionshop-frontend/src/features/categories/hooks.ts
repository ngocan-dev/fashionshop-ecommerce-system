'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCategory, fetchCategories } from './services';
import { queryKeys } from '@/lib/api/query-keys';

export function useCategoriesQuery() {
  return useQuery({ queryKey: queryKeys.categories, queryFn: fetchCategories });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}
