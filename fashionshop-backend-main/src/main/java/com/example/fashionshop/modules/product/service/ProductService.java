package com.example.fashionshop.modules.product.service;

import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.modules.product.dto.ProductDetailResponse;
import com.example.fashionshop.modules.product.dto.ProductManageSummaryResponse;
import com.example.fashionshop.modules.product.dto.ProductManageUpdateRequest;
import com.example.fashionshop.modules.product.dto.ProductRequest;
import com.example.fashionshop.modules.product.dto.ProductResponse;
import com.example.fashionshop.modules.product.dto.ProductSearchResponse;
import com.example.fashionshop.modules.product.dto.StoreProductDetailResponse;
import com.example.fashionshop.modules.product.dto.StoreProductSummaryResponse;

import java.util.List;

public interface ProductService {
    ProductResponse create(ProductRequest request);

    ProductResponse update(Integer productId, ProductRequest request);

    void delete(Integer productId);

    ProductResponse getDetail(Integer productId);

    ProductDetailResponse getManageDetail(Integer productId);

    ProductDetailResponse updateManageProduct(Integer productId, ProductManageUpdateRequest request);

    PaginationResponse<ProductManageSummaryResponse> getManageProducts(int page, int size, String keyword);

    PaginationResponse<ProductResponse> getProducts(int page, int size, String keyword);

    PaginationResponse<StoreProductSummaryResponse> getStoreProducts(int page, int size);

    StoreProductDetailResponse getStoreProductDetail(String idOrSlug);

    List<ProductSearchResponse> searchProducts(String keyword);
}