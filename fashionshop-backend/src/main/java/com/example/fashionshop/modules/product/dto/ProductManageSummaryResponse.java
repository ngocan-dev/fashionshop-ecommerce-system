package com.example.fashionshop.modules.product.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductManageSummaryResponse {
    private Integer id;
    private String productCode;
    private String name;
    private String sku;
    private Integer categoryId;
    private String categoryName;
    private BigDecimal price;
    private Integer stockQuantity;
    private String stockStatus;
    private Boolean isActive;
    private String status;
    private String thumbnailUrl;
    private String detailUrl;
}
