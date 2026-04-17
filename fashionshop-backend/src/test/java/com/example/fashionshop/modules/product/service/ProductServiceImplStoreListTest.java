package com.example.fashionshop.modules.product.service;

import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.StoreProductListLoadException;
import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.modules.category.entity.Category;
import com.example.fashionshop.modules.category.repository.CategoryRepository;
import com.example.fashionshop.modules.product.dto.StoreProductSummaryResponse;
import com.example.fashionshop.modules.product.entity.Product;
import com.example.fashionshop.modules.product.repository.ProductRepository;
import com.example.fashionshop.modules.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplStoreListTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void getStoreProducts_shouldReturnMappedProductsWhenDataExists() {
        Category category = Category.builder().id(2).name("Shirts").build();
        Product product = Product.builder()
                .id(5)
                .name("Oxford Shirt")
                .description("A timeless oxford silhouette for business casual wardrobes.")
                .category(category)
                .price(new BigDecimal("49.99"))
                .stockQuantity(18)
                .isActive(true)
                .imageUrl("https://cdn.example.com/p5-main.jpg,https://cdn.example.com/p5-alt.jpg")
                .createdAt(LocalDateTime.of(2026, 2, 1, 9, 0))
                .build();

        when(productRepository.findByIsActiveTrueOrderByCreatedAtDesc(PageRequest.of(0, 12)))
                .thenReturn(new PageImpl<>(List.of(product), PageRequest.of(0, 12), 1));

        PaginationResponse<StoreProductSummaryResponse> response = productService.getStoreProducts(0, 12);

        assertEquals(1, response.getItems().size());
        assertEquals("Oxford Shirt", response.getItems().get(0).getName());
        assertEquals("https://cdn.example.com/p5-main.jpg", response.getItems().get(0).getImageUrl());
        assertEquals("/products/5", response.getItems().get(0).getProductDetailUrl());
    }

    @Test
    void getStoreProducts_shouldThrowBadRequestWhenPaginationInvalid() {
        assertThrows(BadRequestException.class, () -> productService.getStoreProducts(-1, 12));
        assertThrows(BadRequestException.class, () -> productService.getStoreProducts(0, 0));
        assertThrows(BadRequestException.class, () -> productService.getStoreProducts(0, 100));
    }

    @Test
    void getStoreProducts_shouldThrowLoadExceptionWhenRepositoryFails() {
        when(productRepository.findByIsActiveTrueOrderByCreatedAtDesc(PageRequest.of(0, 12)))
                .thenThrow(new RuntimeException("db error"));

        assertThrows(StoreProductListLoadException.class, () -> productService.getStoreProducts(0, 12));
    }
}
