package com.example.fashionshop.modules.product.service;

import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.ProductDeletionException;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.modules.category.repository.CategoryRepository;
import com.example.fashionshop.modules.product.entity.Product;
import com.example.fashionshop.modules.product.repository.ProductRepository;
import com.example.fashionshop.modules.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplDeleteTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void delete_shouldThrowBadRequestWhenIdIsInvalid() {
        assertThrows(BadRequestException.class, () -> productService.delete(null));
        assertThrows(BadRequestException.class, () -> productService.delete(0));
    }

    @Test
    void delete_shouldThrowNotFoundWhenProductDoesNotExist() {
        when(productRepository.findByIdAndIsActiveTrue(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.delete(999));
    }

    @Test
    void delete_shouldSoftDeleteProductWhenProductExists() {
        Product product = Product.builder().id(101).isActive(true).build();
        when(productRepository.findByIdAndIsActiveTrue(101)).thenReturn(Optional.of(product));

        productService.delete(101);

        assertFalse(product.getIsActive());
        verify(productRepository).save(product);
    }

    @Test
    void delete_shouldThrowProductDeletionExceptionWhenPersistenceFails() {
        Product product = Product.builder().id(101).isActive(true).build();
        when(productRepository.findByIdAndIsActiveTrue(101)).thenReturn(Optional.of(product));
        when(productRepository.save(product)).thenThrow(new RuntimeException("db error"));

        assertThrows(ProductDeletionException.class, () -> productService.delete(101));
    }
}
