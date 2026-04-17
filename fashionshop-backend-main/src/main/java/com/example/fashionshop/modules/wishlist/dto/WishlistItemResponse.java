package com.example.fashionshop.modules.wishlist.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class WishlistItemResponse {
    private Integer wishlistId;
    private Integer productId;
    private String productName;
    private BigDecimal price;
    private String imageUrl;
    private LocalDateTime createdAt;
}
