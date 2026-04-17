package com.example.fashionshop.modules.product.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class StoreProductSummaryResponse {
    private Integer id;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private String categoryName;
    private String shortDescription;
    private Boolean inStock;
    private String productDetailUrl;
}
