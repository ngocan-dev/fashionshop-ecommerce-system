package com.example.fashionshop.modules.cart.service;

import com.example.fashionshop.modules.cart.dto.AddToCartRequest;
import com.example.fashionshop.modules.cart.dto.CartResponse;
import com.example.fashionshop.modules.cart.dto.UpdateCartItemRequest;

public interface CartService {
    CartResponse getMyCart();

    CartResponse addToCart(AddToCartRequest request);

    CartResponse updateCartItemQuantity(Integer itemId, UpdateCartItemRequest request);

    CartResponse updateCartItem(Integer itemId, UpdateCartItemRequest request);

    CartResponse removeCartItem(Integer itemId);
}
