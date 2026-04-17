package com.example.fashionshop.modules.product.service;

import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.ProductUpdateException;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.modules.category.entity.Category;
import com.example.fashionshop.modules.category.repository.CategoryRepository;
import com.example.fashionshop.modules.product.dto.ProductDetailResponse;
import com.example.fashionshop.modules.product.dto.ProductManageUpdateRequest;
import com.example.fashionshop.modules.product.dto.ProductStatus;
import com.example.fashionshop.modules.product.entity.Product;
import com.example.fashionshop.modules.product.repository.ProductRepository;
import com.example.fashionshop.modules.user.entity.User;
import com.example.fashionshop.modules.user.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplManageUpdateTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void updateManageProduct_shouldUpdateAndReturnDetail() {
        Product product = Product.builder()
                .id(7)
                .name("Old Name")
                .stockQuantity(2)
                .isActive(true)
                .category(Category.builder().id(1).name("Old").build())
                .build();
        Category newCategory = Category.builder().id(3).name("Dresses").build();
        User staff = User.builder().id(5).email("staff@example.com").build();

        ProductManageUpdateRequest request = new ProductManageUpdateRequest();
        request.setName("Summer Dress");
        request.setDescription("Light cotton dress");
        request.setCategoryId(3);
        request.setPrice(new BigDecimal("89.99"));
        request.setStockQuantity(10);
        request.setImageUrls(List.of("https://cdn.example.com/p7-main.jpg", "https://cdn.example.com/p7-side.jpg"));
        request.setStatus(ProductStatus.ACTIVE);

        when(productRepository.findById(7)).thenReturn(Optional.of(product));
        when(categoryRepository.findById(3)).thenReturn(Optional.of(newCategory));
        when(userRepository.findByEmail("staff@example.com")).thenReturn(Optional.of(staff));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SecurityContextHolder.getContext()
                .setAuthentication(new UsernamePasswordAuthenticationToken("staff@example.com", "N/A"));

        ProductDetailResponse response = productService.updateManageProduct(7, request);

        assertEquals(7, response.getId());
        assertEquals("Summer Dress", response.getName());
        assertEquals("Dresses", response.getCategoryName());
        assertEquals(2, response.getImageUrls().size());
        assertEquals("ACTIVE_IN_STOCK", response.getStatus());
    }

    @Test
    void updateManageProduct_shouldThrowBadRequestWhenIdInvalid() {
        ProductManageUpdateRequest request = new ProductManageUpdateRequest();
        assertThrows(BadRequestException.class, () -> productService.updateManageProduct(0, request));
    }

    @Test
    void updateManageProduct_shouldThrowNotFoundWhenProductMissing() {
        ProductManageUpdateRequest request = new ProductManageUpdateRequest();
        request.setCategoryId(1);
        when(productRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.updateManageProduct(999, request));
    }

    @Test
    void updateManageProduct_shouldThrowProductUpdateFailedWhenUnexpectedErrorOccurs() {
        ProductManageUpdateRequest request = new ProductManageUpdateRequest();
        request.setCategoryId(1);
        when(productRepository.findById(7)).thenThrow(new RuntimeException("db down"));

        assertThrows(ProductUpdateException.class, () -> productService.updateManageProduct(7, request));
    }
}
