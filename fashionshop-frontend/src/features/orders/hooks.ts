'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelMyOrder, createOrder, fetchCheckoutSummary, fetchManageOrder, fetchManageOrders, fetchMyOrder, fetchMyOrderHistory, fetchMyOrderPayment, fetchMyOrderStatus, fetchMyOrders, fetchOrder, fetchOrders, updateCheckoutPaymentMethod, updateManageOrderStatus, updateOrderStatus } from './services';
import { queryKeys } from '@/lib/api/query-keys';
import type { OrderFilter } from '@/types/order';

export function useCheckoutSummaryQuery() {
  return useQuery({ queryKey: ['orders', 'checkout-summary'], queryFn: fetchCheckoutSummary });
}

export function useUpdateCheckoutPaymentMethodMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCheckoutPaymentMethod,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orders', 'checkout-summary'] });
    },
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

export function useMyOrdersQuery() {
  return useQuery({ queryKey: [...queryKeys.orders, 'my'], queryFn: fetchMyOrders });
}

export function useMyOrderHistoryQuery() {
  return useQuery({ queryKey: [...queryKeys.orders, 'my', 'history'], queryFn: fetchMyOrderHistory });
}

export function useMyOrderQuery(orderId: string) {
  return useQuery({ queryKey: queryKeys.order(orderId), queryFn: () => fetchMyOrder(orderId), enabled: Boolean(orderId) });
}

export function useMyOrderPaymentQuery(orderId: string) {
  return useQuery({ queryKey: [...queryKeys.order(orderId), 'payment'], queryFn: () => fetchMyOrderPayment(orderId), enabled: Boolean(orderId) });
}

export function useMyOrderStatusQuery(orderId: string) {
  return useQuery({ queryKey: [...queryKeys.order(orderId), 'status'], queryFn: () => fetchMyOrderStatus(orderId), enabled: Boolean(orderId) });
}

export function useCancelMyOrderMutation(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelMyOrder(orderId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.order(orderId) });
      await queryClient.invalidateQueries({ queryKey: [...queryKeys.orders, 'my'] });
    },
  });
}

export function useOrdersQuery() {
  return useQuery({ queryKey: queryKeys.orders, queryFn: fetchOrders });
}

export function useManageOrdersQuery(filter?: OrderFilter) {
  return useQuery({ 
    queryKey: [...queryKeys.orders, 'manage', filter], 
    queryFn: () => fetchManageOrders(filter) 
  });
}

export function useManageOrderQuery(orderId: string) {
  return useQuery({ queryKey: [...queryKeys.orders, 'manage', orderId], queryFn: () => fetchManageOrder(orderId), enabled: Boolean(orderId) });
}

export function useOrderQuery(orderId: string) {
  return useQuery({ queryKey: queryKeys.order(orderId), queryFn: () => fetchOrder(orderId), enabled: Boolean(orderId) });
}

export function useUpdateOrderStatusMutation(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => updateOrderStatus(orderId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.order(orderId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
  });
}

export function useUpdateManageOrderStatusMutation(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => updateManageOrderStatus(orderId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [...queryKeys.orders, 'manage'] });
    },
  });
}
