package com.example.fashionshop.modules.cart.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.modules.cart.dto.AddToCartRequest;
import com.example.fashionshop.modules.cart.dto.CartResponse;
import com.example.fashionshop.modules.cart.dto.UpdateCartItemRequest;
import com.example.fashionshop.modules.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ApiResponse<CartResponse> getMyCart() {
        return ApiResponse.success("Cart fetched successfully", cartService.getMyCart());
    }

    @GetMapping("/summary")
    public ApiResponse<Integer> getMyCartItemCount() {
        return ApiResponse.success("Cart item count fetched successfully", cartService.getMyCart().getTotalItems());
    }

    @PostMapping("/items")
    public ApiResponse<CartResponse> addToCart(@Valid @RequestBody AddToCartRequest request) {
        return ApiResponse.success("Added to cart successfully", cartService.addToCart(request));
    }

    @PutMapping("/items/{itemId}")
    public ApiResponse<CartResponse> updateCartItemGeneral(@PathVariable Integer itemId,
                                                           @Valid @RequestBody UpdateCartItemRequest request) {
        return ApiResponse.success("Cart item updated successfully", cartService.updateCartItemQuantity(itemId, request));
    }

    @PutMapping("/items/{itemId}/quantity")
    public ApiResponse<CartResponse> updateCartItem(@PathVariable Integer itemId,
                                                            @Valid @RequestBody UpdateCartItemRequest request) {
        return ApiResponse.success("Cart item updated successfully", cartService.updateCartItemQuantity(itemId, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ApiResponse<CartResponse> removeCartItem(@PathVariable Integer itemId) {
        return ApiResponse.success("Item removed from cart", cartService.removeCartItem(itemId));
    }
}
