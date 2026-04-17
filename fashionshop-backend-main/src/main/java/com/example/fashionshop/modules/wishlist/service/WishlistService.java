package com.example.fashionshop.modules.wishlist.service;

import com.example.fashionshop.modules.wishlist.dto.AddWishlistItemRequest;
import com.example.fashionshop.modules.wishlist.dto.AddWishlistItemResponse;
import com.example.fashionshop.modules.wishlist.dto.WishlistResponse;

import java.util.List;

public interface WishlistService {
    List<WishlistResponse> getMyWishlist();

    AddWishlistItemResponse addToWishlist(AddWishlistItemRequest request);

    boolean isProductInWishlist(Integer productId);

    void removeFromWishlist(Integer productId);
}
