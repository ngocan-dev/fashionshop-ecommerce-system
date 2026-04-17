package com.example.fashionshop.modules.product.service;

import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.ProductListLoadException;
import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.modules.category.entity.Category;
import com.example.fashionshop.modules.category.repository.CategoryRepository;
import com.example.fashionshop.modules.product.dto.ProductManageSummaryResponse;
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
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplManageListTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void getManageProducts_shouldReturnMappedProductsWhenDataExists() {
        Category category = Category.builder().id(2).name("Shirts").build();
        Product product = Product.builder()
                .id(5)
                .name("Oxford Shirt")
                .category(category)
                .price(new BigDecimal("49.99"))
                .stockQuantity(18)
                .isActive(true)
                .imageUrl("https://cdn.example.com/p5.jpg")
                .build();

        when(productRepository.findByIsActiveTrue(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(product), PageRequest.of(0, 10), 1));

        PaginationResponse<ProductManageSummaryResponse> response = productService.getManageProducts(0, 10, null);

        assertEquals(1, response.getItems().size());
        assertEquals("SKU-5", response.getItems().get(0).getSku());
        assertEquals("IN_STOCK", response.getItems().get(0).getStockStatus());
        assertEquals("ACTIVE", response.getItems().get(0).getStatus());
    }

    @Test
    void getManageProducts_shouldThrowBadRequestWhenPagingInvalid() {
        assertThrows(BadRequestException.class, () -> productService.getManageProducts(-1, 10, null));
        assertThrows(BadRequestException.class, () -> productService.getManageProducts(0, 0, null));
    }

    @Test
    void getManageProducts_shouldThrowLoadExceptionWhenRepositoryFails() {
        when(productRepository.findByIsActiveTrue(PageRequest.of(0, 10))).thenThrow(new RuntimeException("db error"));

        assertThrows(ProductListLoadException.class, () -> productService.getManageProducts(0, 10, null));
    }
}
