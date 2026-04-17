package com.example.fashionshop.modules.product.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class StoreProductDetailResponse {
    private Integer id;
    private String slug;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private Boolean inStock;
    private String availabilityStatus;
    private String availabilityLabel;
    private String categoryName;
    private String productCode;
    private String sku;
    private String mainImageUrl;
    private List<String> galleryImages;

    private List<String> highlights;
    private String material;
    private List<String> sizeOptions;
    private List<String> colorOptions;
    private String dimensions;
    private String careInstructions;
    private String brand;
    private List<String> tags;

    private Integer defaultQuantity;
    private Integer minQuantity;
    private Integer maxQuantity;
    private Boolean addToCartEnabled;
    private Boolean buyNowEnabled;
}
