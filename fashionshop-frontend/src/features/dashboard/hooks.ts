'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from './services';
import { queryKeys } from '@/lib/api/query-keys';

export function useDashboardQuery(from: string, to: string) {
  return useQuery({ queryKey: queryKeys.dashboard(from, to), queryFn: () => fetchDashboard(from, to), enabled: Boolean(from && to) });
}
