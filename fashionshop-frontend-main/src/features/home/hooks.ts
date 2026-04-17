'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchHome } from './services';
import { queryKeys } from '@/lib/api/query-keys';

export function useHomeQuery() {
  return useQuery({ queryKey: queryKeys.home, queryFn: fetchHome });
}
