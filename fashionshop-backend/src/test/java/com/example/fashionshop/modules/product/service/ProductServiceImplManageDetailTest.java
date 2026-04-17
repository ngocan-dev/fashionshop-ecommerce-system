package com.example.fashionshop.modules.product.service;

import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.ProductDetailLoadException;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.modules.category.entity.Category;
import com.example.fashionshop.modules.category.repository.CategoryRepository;
import com.example.fashionshop.modules.product.dto.ProductDetailResponse;
import com.example.fashionshop.modules.product.entity.Product;
import com.example.fashionshop.modules.product.repository.ProductRepository;
import com.example.fashionshop.modules.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplManageDetailTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void getManageDetail_shouldReturnMappedProductDetailWhenProductExists() {
        Category category = Category.builder().id(3).name("Dresses").build();
        Product product = Product.builder()
                .id(7)
                .name("Summer Dress")
                .description("Light cotton dress")
                .category(category)
                .price(new BigDecimal("89.99"))
                .stockQuantity(5)
                .isActive(true)
                .imageUrl("https://cdn.example.com/p7.jpg")
                .createdAt(LocalDateTime.of(2025, 1, 15, 10, 0))
                .updatedAt(LocalDateTime.of(2026, 2, 20, 11, 0))
                .build();

        when(productRepository.findByIdAndIsActiveTrue(7)).thenReturn(Optional.of(product));

        ProductDetailResponse response = productService.getManageDetail(7);

        assertEquals(7, response.getId());
        assertEquals("SKU-7", response.getProductCode());
        assertEquals("Dresses", response.getCategoryName());
        assertEquals("ACTIVE_IN_STOCK", response.getStatus());
    }

    @Test
    void getManageDetail_shouldThrowBadRequestWhenIdIsInvalid() {
        assertThrows(BadRequestException.class, () -> productService.getManageDetail(0));
    }

    @Test
    void getManageDetail_shouldThrowNotFoundWhenProductMissing() {
        when(productRepository.findByIdAndIsActiveTrue(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getManageDetail(999));
    }

    @Test
    void getManageDetail_shouldThrowLoadExceptionWhenRepositoryFails() {
        when(productRepository.findByIdAndIsActiveTrue(12)).thenThrow(new RuntimeException("Database unavailable"));

        assertThrows(ProductDetailLoadException.class, () -> productService.getManageDetail(12));
    }
}
