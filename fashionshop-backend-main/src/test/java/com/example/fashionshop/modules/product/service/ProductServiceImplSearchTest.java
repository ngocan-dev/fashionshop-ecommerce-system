package com.example.fashionshop.modules.product.service;

import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.SearchResultLoadException;
import com.example.fashionshop.modules.category.entity.Category;
import com.example.fashionshop.modules.category.repository.CategoryRepository;
import com.example.fashionshop.modules.product.dto.ProductSearchResponse;
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
class ProductServiceImplSearchTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void searchProducts_shouldTrimKeywordAndReturnTopFiveMappedItems() {
        Category category = Category.builder().id(3).name("Dresses").build();
        Product first = Product.builder()
                .id(11)
                .name("Summer Dress")
                .category(category)
                .description("Lightweight and breathable summer dress for daily wear")
                .price(new BigDecimal("79.99"))
                .stockQuantity(8)
                .imageUrl("https://cdn.example.com/11-primary.jpg, https://cdn.example.com/11-alt.jpg")
                .isActive(true)
                .build();

        when(productRepository.searchActiveProductsByKeyword("dress", PageRequest.of(0, 5)))
                .thenReturn(new PageImpl<>(List.of(first), PageRequest.of(0, 5), 1));

        List<ProductSearchResponse> results = productService.searchProducts("  dress  ");

        assertEquals(1, results.size());
        assertEquals("Summer Dress", results.get(0).getName());
        assertEquals("https://cdn.example.com/11-primary.jpg", results.get(0).getThumbnailImageUrl());
        assertEquals("IN_STOCK", results.get(0).getStockStatus());
    }

    @Test
    void searchProducts_shouldThrowBadRequestWhenKeywordEmpty() {
        assertThrows(BadRequestException.class, () -> productService.searchProducts("   "));
    }

    @Test
    void searchProducts_shouldThrowSearchLoadExceptionWhenRepositoryFails() {
        when(productRepository.searchActiveProductsByKeyword("dress", PageRequest.of(0, 5)))
                .thenThrow(new RuntimeException("db error"));

        assertThrows(SearchResultLoadException.class, () -> productService.searchProducts("dress"));
    }
}
