package com.example.fashionshop.modules.wishlist.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class WishlistResponse {
    private Integer wishlistId;
    private Integer productId;
    private String productName;
    private BigDecimal price;
    private String imageUrl;
}
