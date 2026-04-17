'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addWishlistItem, checkWishlistContains, deleteWishlistItem, fetchWishlist } from './services';
import { queryKeys } from '@/lib/api/query-keys';

export function useWishlistQuery() {
  return useQuery({ queryKey: queryKeys.wishlist, queryFn: fetchWishlist });
}

export function useWishlistContainsQuery(productId: number) {
  return useQuery({ queryKey: [...queryKeys.wishlist, 'contains', productId], queryFn: () => checkWishlistContains(productId), enabled: Boolean(productId) });
}

export function useAddWishlistItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addWishlistItem,
    onMutate: async (productId: number) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist });
      const previous = queryClient.getQueryData<unknown[]>(queryKeys.wishlist);
      return { previous, productId };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
    },
  });
}

export function useDeleteWishlistItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWishlistItem,
    onMutate: async (productId: number) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist });
      const previous = queryClient.getQueryData<unknown[]>(queryKeys.wishlist);
      queryClient.setQueryData<unknown[]>(queryKeys.wishlist, (current) => (current ?? []).filter((item: any) => item.productId !== productId));
      return { previous };
    },
    onError: (_error, _productId, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.wishlist, context.previous);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
    },
  });
}
