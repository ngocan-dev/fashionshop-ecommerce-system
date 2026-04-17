package com.example.fashionshop.modules.product.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProductDetailResponse {
    private Integer id;
    private String productCode;
    private String name;
    private String description;
    private Integer categoryId;
    private String categoryName;
    private BigDecimal price;
    private Integer stockQuantity;
    private Boolean isActive;
    private Boolean inStock;
    private String status;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
