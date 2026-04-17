'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPayment, fetchOrderPayment, fetchOrderPaymentSummary, payOrder } from './services';
import { queryKeys } from '@/lib/api/query-keys';

export function useOrderPaymentQuery(orderId: string) {
  return useQuery({ queryKey: queryKeys.payments(orderId), queryFn: () => fetchOrderPayment(orderId), enabled: Boolean(orderId) });
}

export function useOrderPaymentSummaryQuery(orderId: string) {
  return useQuery({ queryKey: [...queryKeys.payments(orderId), 'summary'], queryFn: () => fetchOrderPaymentSummary(orderId), enabled: Boolean(orderId) });
}

export function usePayOrderMutation(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: Parameters<typeof payOrder>[1]) => payOrder(orderId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.payments(orderId) });
    },
  });
}

export function useCreatePaymentMutation() {
  return useMutation({ mutationFn: createPayment });
}
