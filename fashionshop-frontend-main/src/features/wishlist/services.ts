import { api, apiRequest } from '@/lib/api/http';
import type { ApiResponse } from '@/lib/api/types';
import type { WishlistItem } from '@/types/wishlist';
import { mockWishlist, allMockProducts } from '@/data/mock-data';

// TODO: Remove mock helpers once the real backend is available
const USE_MOCK = false;

// Mutable in-memory wishlist so add/remove actually persist during the session
const wishlistStore: WishlistItem[] = [...mockWishlist];

export async function fetchWishlist() {
  if (USE_MOCK) return [...wishlistStore];
  const response = await api.get<ApiResponse<WishlistItem[]>>('/api/wishlist');
  return apiRequest(Promise.resolve(response));
}

export async function checkWishlistContains(productId: number) {
  if (USE_MOCK) return wishlistStore.some((item) => item.productId === productId);
  const response = await api.get<ApiResponse<boolean>>(`/api/wishlist/items/contains/${productId}`);
  return apiRequest(Promise.resolve(response));
}

export async function addWishlistItem(productId: number) {
  if (USE_MOCK) {
    if (!wishlistStore.some((item) => item.productId === productId)) {
      wishlistStore.push({
        wishlistId: Date.now(),
        productId,
        productName: 'Unknown Product',
        price: 0,
      });
    }
    return [...wishlistStore];
  }
  const response = await api.post<ApiResponse<WishlistItem[]>>('/api/wishlist/items', { productId });
  return apiRequest(Promise.resolve(response));
}

export async function deleteWishlistItem(productId: number) {
  if (USE_MOCK) {
    const index = wishlistStore.findIndex((item) => item.productId === productId);
    if (index !== -1) wishlistStore.splice(index, 1);
    return [...wishlistStore];
  }
  const response = await api.delete<ApiResponse<WishlistItem[]>>(`/api/wishlist/items/${productId}`);
  return apiRequest(Promise.resolve(response));
}
