package com.example.fashionshop.modules.product.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.modules.product.dto.ProductDetailResponse;
import com.example.fashionshop.modules.product.dto.ProductManageSummaryResponse;
import com.example.fashionshop.modules.product.dto.ProductManageUpdateRequest;
import com.example.fashionshop.modules.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products/manage")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('STAFF','ADMIN')")
public class AdminProductController {

    private final ProductService productService;

    @GetMapping
    public ApiResponse<PaginationResponse<ProductManageSummaryResponse>> getProductList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        PaginationResponse<ProductManageSummaryResponse> response = productService.getManageProducts(page, size, keyword);
        String message = response.getItems().isEmpty() ? "No products available" : "Product list fetched successfully";
        return ApiResponse.success(message, response);
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductDetailResponse> getProductDetail(@PathVariable Integer id) {
        return ApiResponse.success("Product detail fetched successfully", productService.getManageDetail(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Integer id) {
        productService.delete(id);
        return ApiResponse.success("Product deleted successfully", null);
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductDetailResponse> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody ProductManageUpdateRequest request) {
        return ApiResponse.success("Product updated successfully", productService.updateManageProduct(id, request));
    }
}
