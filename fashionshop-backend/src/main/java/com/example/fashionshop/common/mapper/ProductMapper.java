package com.example.fashionshop.common.mapper;

import com.example.fashionshop.modules.product.dto.ProductDetailResponse;
import com.example.fashionshop.modules.product.dto.ProductManageSummaryResponse;
import com.example.fashionshop.modules.product.dto.ProductResponse;
import com.example.fashionshop.modules.product.dto.StoreProductDetailResponse;
import com.example.fashionshop.modules.product.dto.StoreProductSummaryResponse;
import com.example.fashionshop.modules.product.entity.Product;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public final class ProductMapper {

    private ProductMapper() {
    }

    public static ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(getPrimaryImageUrl(product.getImageUrl()))
                .stockQuantity(product.getStockQuantity())
                .isActive(product.getIsActive())
                .manageDetailUrl("/api/products/manage/" + product.getId())
                .build();
    }

    public static ProductManageSummaryResponse toManageSummaryResponse(Product product) {
        boolean inStock = product.getStockQuantity() != null && product.getStockQuantity() > 0;
        boolean active = Boolean.TRUE.equals(product.getIsActive());

        return ProductManageSummaryResponse.builder()
                .id(product.getId())
                .productCode("SKU-" + product.getId())
                .sku("SKU-" + product.getId())
                .name(product.getName())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .stockStatus(inStock ? "IN_STOCK" : "OUT_OF_STOCK")
                .isActive(product.getIsActive())
                .status(active ? "ACTIVE" : "INACTIVE")
                .thumbnailUrl(getPrimaryImageUrl(product.getImageUrl()))
                .detailUrl("/api/products/manage/" + product.getId())
                .build();
    }

    public static StoreProductSummaryResponse toStoreSummaryResponse(Product product) {
        String description = product.getDescription();
        String shortDescription = description == null ? null : description.trim();

        if (shortDescription != null && shortDescription.length() > 120) {
            shortDescription = shortDescription.substring(0, 117) + "...";
        }

        return StoreProductSummaryResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .imageUrl(getPrimaryImageUrl(product.getImageUrl()))
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .shortDescription(shortDescription)
                .inStock(product.getStockQuantity() != null && product.getStockQuantity() > 0)
                .productDetailUrl("/products/" + product.getId())
                .build();
    }


    public static StoreProductDetailResponse toStoreDetailResponse(Product product) {
        List<String> imageUrls = parseImageUrls(product.getImageUrl());
        boolean inStock = product.getStockQuantity() != null && product.getStockQuantity() > 0;

        return StoreProductDetailResponse.builder()
                .id(product.getId())
                .slug("product-" + product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .originalPrice(null)
                .salePrice(null)
                .stockQuantity(product.getStockQuantity())
                .inStock(inStock)
                .availabilityStatus(inStock ? "IN_STOCK" : "OUT_OF_STOCK")
                .availabilityLabel(inStock ? "In stock" : "Out of stock")
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .productCode("SKU-" + product.getId())
                .sku("SKU-" + product.getId())
                .mainImageUrl(imageUrls.isEmpty() ? null : imageUrls.get(0))
                .galleryImages(imageUrls)
                .highlights(Collections.emptyList())
                .material(null)
                .sizeOptions(Collections.emptyList())
                .colorOptions(Collections.emptyList())
                .dimensions(null)
                .careInstructions(null)
                .brand(null)
                .tags(Collections.emptyList())
                .defaultQuantity(1)
                .minQuantity(1)
                .maxQuantity(inStock ? product.getStockQuantity() : 0)
                .addToCartEnabled(inStock)
                .buyNowEnabled(inStock)
                .build();
    }

    public static ProductDetailResponse toDetailResponse(Product product) {
        boolean inStock = product.getStockQuantity() != null && product.getStockQuantity() > 0;
        boolean active = Boolean.TRUE.equals(product.getIsActive());

        return ProductDetailResponse.builder()
                .id(product.getId())
                .productCode("SKU-" + product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .isActive(product.getIsActive())
                .inStock(inStock)
                .status(active ? (inStock ? "ACTIVE_IN_STOCK" : "ACTIVE_OUT_OF_STOCK") : "INACTIVE")
                .imageUrls(parseImageUrls(product.getImageUrl()))
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private static String getPrimaryImageUrl(String imageUrl) {
        List<String> parsedUrls = parseImageUrls(imageUrl);
        return parsedUrls.isEmpty() ? null : parsedUrls.get(0);
    }

    private static List<String> parseImageUrls(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return Collections.emptyList();
        }

        return Arrays.stream(imageUrl.split(","))
                .map(String::trim)
                .filter(url -> !url.isBlank())
                .toList();
    }

}
