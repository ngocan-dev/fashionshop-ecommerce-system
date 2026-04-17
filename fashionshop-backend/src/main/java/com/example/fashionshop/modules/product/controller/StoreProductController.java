package com.example.fashionshop.modules.product.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.modules.product.dto.StoreProductDetailResponse;
import com.example.fashionshop.modules.product.dto.StoreProductSummaryResponse;
import com.example.fashionshop.modules.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/store/products")
@RequiredArgsConstructor
public class StoreProductController {

    private final ProductService productService;


    @GetMapping("/{idOrSlug}")
    public ApiResponse<StoreProductDetailResponse> getDetail(@PathVariable String idOrSlug) {
        StoreProductDetailResponse response = productService.getStoreProductDetail(idOrSlug);
        return ApiResponse.success("Product details fetched successfully", response);
    }

    @GetMapping
    public ApiResponse<PaginationResponse<StoreProductSummaryResponse>> browse(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        PaginationResponse<StoreProductSummaryResponse> response = productService.getStoreProducts(page, size);
        String message = response.getItems().isEmpty() ? "No products available" : "Products fetched successfully";
        return ApiResponse.success(message, response);
    }
}
