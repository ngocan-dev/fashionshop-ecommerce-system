package com.example.fashionshop.modules.product.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductSearchResponse {
    private Integer id;
    private String slug;
    private String name;
    private String categoryName;
    private BigDecimal price;
    private String thumbnailImageUrl;
    private String descriptionSnippet;
    private Boolean inStock;
    private String stockStatus;
    private String productDetailUrl;
}
