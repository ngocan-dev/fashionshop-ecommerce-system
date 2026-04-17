import type { Product } from './product';

export type CartItem = {
  itemId: number;
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  lineTotal: number;
  /** Kept for components that embed a full product object from local state */
  product?: Product;
};

export type Cart = {
  cartId: number;
  items: CartItem[];
  totalItems: number;
  distinctItemCount: number;
  subtotal: number;
  totalPrice: number;
  empty: boolean;
};

export type AddCartItemRequest = {
  productId: number;
  quantity: number;
};

export type UpdateCartItemRequest = {
  quantity: number;
};
