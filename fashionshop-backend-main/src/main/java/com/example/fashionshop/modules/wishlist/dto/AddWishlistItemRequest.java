package com.example.fashionshop.modules.wishlist.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AddWishlistItemRequest {

    @NotNull(message = "Product ID is required")
    @Positive(message = "Invalid product id")
    private Integer productId;
}
