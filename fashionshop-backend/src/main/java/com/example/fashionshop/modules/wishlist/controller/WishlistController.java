package com.example.fashionshop.modules.wishlist.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.modules.wishlist.dto.AddWishlistItemRequest;
import com.example.fashionshop.modules.wishlist.dto.AddWishlistItemResponse;
import com.example.fashionshop.modules.wishlist.dto.WishlistResponse;
import com.example.fashionshop.modules.wishlist.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ApiResponse<List<WishlistResponse>> getMyWishlist() {
        return ApiResponse.success("Wishlist fetched successfully", wishlistService.getMyWishlist());
    }

    @GetMapping("/items/contains/{productId}")
    public ApiResponse<Boolean> isProductInWishlist(@PathVariable Integer productId) {
        return ApiResponse.success("Wishlist state fetched successfully", wishlistService.isProductInWishlist(productId));
    }

    @PostMapping("/items")
    public ApiResponse<AddWishlistItemResponse> addToWishlist(@Valid @RequestBody AddWishlistItemRequest request) {
        AddWishlistItemResponse response = wishlistService.addToWishlist(request);
        String message = response.isAlreadyInWishlist()
                ? "Product already in wishlist"
                : "Added to wishlist successfully";
        return ApiResponse.success(message, response);
    }

    @DeleteMapping("/items/{productId}")
    public ApiResponse<Void> removeFromWishlist(@PathVariable Integer productId) {
        wishlistService.removeFromWishlist(productId);
        return ApiResponse.success("Removed from wishlist successfully", null);
    }
}
