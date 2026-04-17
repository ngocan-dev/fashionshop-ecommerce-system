package com.example.fashionshop.modules.product.controller;

import com.example.fashionshop.common.exception.GlobalExceptionHandler;
import com.example.fashionshop.common.exception.ProductDeletionException;
import com.example.fashionshop.common.exception.ProductDetailLoadException;
import com.example.fashionshop.common.exception.ProductListLoadException;
import com.example.fashionshop.common.exception.ProductUpdateException;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.modules.product.dto.ProductDetailResponse;
import com.example.fashionshop.modules.product.dto.ProductManageSummaryResponse;
import com.example.fashionshop.modules.product.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminProductController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({GlobalExceptionHandler.class, com.example.fashionshop.config.TestSecurityConfig.class})
class AdminProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    void getProductList_shouldReturnProductListForAdminOrStaff() throws Exception {
        ProductManageSummaryResponse product = ProductManageSummaryResponse.builder()
                .id(101)
                .productCode("SKU-101")
                .sku("SKU-101")
                .name("Classic Blazer")
                .categoryId(8)
                .categoryName("Blazers")
                .price(new BigDecimal("199.99"))
                .stockQuantity(25)
                .stockStatus("IN_STOCK")
                .isActive(true)
                .status("ACTIVE")
                .thumbnailUrl("https://cdn.example.com/products/101-main.jpg")
                .detailUrl("/api/products/manage/101")
                .build();

        PaginationResponse<ProductManageSummaryResponse> page = PaginationResponse.<ProductManageSummaryResponse>builder()
                .items(List.of(product))
                .page(0)
                .size(10)
                .totalItems(1)
                .totalPages(1)
                .build();

        when(productService.getManageProducts(0, 10, null)).thenReturn(page);

        mockMvc.perform(get("/api/products/manage")
                        .param("page", "0")
                        .param("size", "10")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Product list fetched successfully"))
                .andExpect(jsonPath("$.data.items[0].id").value(101))
                .andExpect(jsonPath("$.data.items[0].stockStatus").value("IN_STOCK"));
    }

    @Test
    void getProductList_shouldReturnNoProductsAvailableWhenListIsEmpty() throws Exception {
        PaginationResponse<ProductManageSummaryResponse> emptyPage = PaginationResponse.<ProductManageSummaryResponse>builder()
                .items(List.of())
                .page(0)
                .size(10)
                .totalItems(0)
                .totalPages(0)
                .build();

        when(productService.getManageProducts(0, 10, null)).thenReturn(emptyPage);

        mockMvc.perform(get("/api/products/manage").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("No products available"))
                .andExpect(jsonPath("$.data.items").isArray());
    }

    @Test
    void getProductList_shouldReturnUnableToLoadWhenRetrievalFails() throws Exception {
        when(productService.getManageProducts(0, 10, null)).thenThrow(new ProductListLoadException());

        mockMvc.perform(get("/api/products/manage").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Unable to load product list"));
    }

    @Test
    void getProductDetail_shouldReturnProductDetailsForAdminOrStaff() throws Exception {
        ProductDetailResponse productDetail = ProductDetailResponse.builder()
                .id(101)
                .productCode("SKU-101")
                .name("Classic Blazer")
                .description("Formal blazer")
                .categoryId(8)
                .categoryName("Blazers")
                .price(new BigDecimal("199.99"))
                .stockQuantity(25)
                .isActive(true)
                .inStock(true)
                .status("ACTIVE_IN_STOCK")
                .imageUrls(List.of("https://cdn.example.com/products/101-main.jpg"))
                .createdAt(LocalDateTime.of(2025, 10, 12, 8, 0))
                .updatedAt(LocalDateTime.of(2026, 3, 10, 9, 0))
                .build();

        when(productService.getManageDetail(101)).thenReturn(productDetail);

        mockMvc.perform(get("/api/products/manage/101").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Product detail fetched successfully"))
                .andExpect(jsonPath("$.data.id").value(101))
                .andExpect(jsonPath("$.data.productCode").value("SKU-101"))
                .andExpect(jsonPath("$.data.imageUrls[0]").value("https://cdn.example.com/products/101-main.jpg"));
    }

    @Test
    void getProductDetail_shouldReturnNotFoundWhenProductDoesNotExist() throws Exception {
        when(productService.getManageDetail(9999)).thenThrow(new ResourceNotFoundException("Product not found"));

        mockMvc.perform(get("/api/products/manage/9999").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Product not found"));
    }

    @Test
    void getProductDetail_shouldReturnUnableToLoadWhenRetrievalFails() throws Exception {
        when(productService.getManageDetail(202)).thenThrow(new ProductDetailLoadException());

        mockMvc.perform(get("/api/products/manage/202").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Unable to load product details"));
    }

    @Test
    void deleteProduct_shouldDeleteProductSuccessfully() throws Exception {
        mockMvc.perform(delete("/api/products/manage/101").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Product deleted successfully"));
    }

    @Test
    void deleteProduct_shouldReturnNotFoundWhenProductDoesNotExist() throws Exception {
        doThrow(new ResourceNotFoundException("Product not found")).when(productService).delete(9999);

        mockMvc.perform(delete("/api/products/manage/9999").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Product not found"));
    }

    @Test
    void deleteProduct_shouldReturnDeletionFailureMessageWhenDeleteFails() throws Exception {
        doThrow(new ProductDeletionException()).when(productService).delete(101);

        mockMvc.perform(delete("/api/products/manage/101").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Product deletion failed"));
    }

    @Test
    void updateProduct_shouldReturnUpdatedProductForAdminOrStaff() throws Exception {
        ProductDetailResponse updated = ProductDetailResponse.builder()
                .id(101)
                .productCode("SKU-101")
                .name("Classic Blazer Updated")
                .description("Updated description")
                .categoryId(8)
                .categoryName("Blazers")
                .price(new BigDecimal("209.99"))
                .stockQuantity(20)
                .isActive(true)
                .inStock(true)
                .status("ACTIVE_IN_STOCK")
                .imageUrls(List.of("https://cdn.example.com/products/101-main.jpg"))
                .build();

        when(productService.updateManageProduct(any(), any())).thenReturn(updated);

        String payload = """
                {
                  \"name\": \"Classic Blazer Updated\",
                  \"description\": \"Updated description\",
                  \"categoryId\": 8,
                  \"price\": 209.99,
                  \"stockQuantity\": 20,
                  \"imageUrls\": [\"https://cdn.example.com/products/101-main.jpg\"],
                  \"status\": \"ACTIVE\"
                }
                """;

        mockMvc.perform(put("/api/products/manage/101")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Product updated successfully"))
                .andExpect(jsonPath("$.data.name").value("Classic Blazer Updated"));
    }

    @Test
    void updateProduct_shouldReturnValidationErrorWhenRequiredFieldsMissing() throws Exception {
        String invalidPayload = """
                {
                  \"description\": \"Updated description\",
                  \"price\": -1,
                  \"stockQuantity\": -2
                }
                """;

        mockMvc.perform(put("/api/products/manage/101")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void updateProduct_shouldReturnProductUpdateFailedWhenServiceFails() throws Exception {
        when(productService.updateManageProduct(any(), any())).thenThrow(new ProductUpdateException());

        String payload = """
                {
                  \"name\": \"Classic Blazer Updated\",
                  \"description\": \"Updated description\",
                  \"categoryId\": 8,
                  \"price\": 209.99,
                  \"stockQuantity\": 20,
                  \"status\": \"ACTIVE\"
                }
                """;

        mockMvc.perform(put("/api/products/manage/101")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Product update failed"));
    }
}
