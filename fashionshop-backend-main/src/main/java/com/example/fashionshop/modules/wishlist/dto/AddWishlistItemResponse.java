package com.example.fashionshop.modules.wishlist.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddWishlistItemResponse {
    private boolean alreadyInWishlist;
    private int wishlistCount;
    private WishlistItemResponse item;
}
