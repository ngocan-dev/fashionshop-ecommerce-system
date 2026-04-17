'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addCartItem, deleteCartItem, fetchCart, fetchCartSummary, updateCartItem, updateCartItemQuantity } from './services';
import { queryKeys } from '@/lib/api/query-keys';
import type { AddCartItemRequest } from '@/types/cart';

export function useCartQuery() {
  return useQuery({ queryKey: queryKeys.cart, queryFn: fetchCart });
}

export function useCartSummaryQuery() {
  return useQuery({ queryKey: queryKeys.cartSummary, queryFn: fetchCartSummary });
}

export function useAddCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCartItem,
    onMutate: async (request: AddCartItemRequest) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });
      const previousCart = queryClient.getQueryData<{ items: unknown[] }>(queryKeys.cart);
      return { previousCart, request };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      await queryClient.invalidateQueries({ queryKey: queryKeys.cartSummary });
    },
  });
}

export function useUpdateCartItemMutation(itemId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: Parameters<typeof updateCartItem>[1]) => updateCartItem(itemId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

export function useUpdateCartItemQuantityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId: targetItemId, quantity }: { itemId: number; quantity: number }) => updateCartItemQuantity(targetItemId, quantity),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      await queryClient.invalidateQueries({ queryKey: queryKeys.cartSummary });
    },
  });
}

export function useDeleteCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCartItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      await queryClient.invalidateQueries({ queryKey: queryKeys.cartSummary });
    },
  });
}
