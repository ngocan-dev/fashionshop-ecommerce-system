package com.example.fashionshop.modules.cart.service;

import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.modules.cart.dto.AddToCartRequest;
import com.example.fashionshop.modules.cart.dto.CartResponse;
import com.example.fashionshop.modules.cart.entity.Cart;
import com.example.fashionshop.modules.cart.entity.CartItem;
import com.example.fashionshop.modules.cart.repository.CartItemRepository;
import com.example.fashionshop.modules.cart.repository.CartRepository;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceImplAddToCartTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartServiceImpl cartService;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void addToCart_shouldMergeQuantityAndReturnUpdatedItemCount() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("customer@example.com", null));

        User user = User.builder().id(2).email("customer@example.com").build();
        Cart cart = Cart.builder().id(10).user(user).build();
        Product product = Product.builder()
                .id(7)
                .name("Slim Fit Jeans")
                .price(new BigDecimal("59.99"))
                .stockQuantity(10)
                .isActive(true)
                .build();
        CartItem existing = CartItem.builder().id(31).cart(cart).product(product).quantity(2).build();

        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(7);
        request.setQuantity(3);

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(productRepository.findById(7)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByCartAndProduct(cart, product)).thenReturn(Optional.of(existing));
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(cartItemRepository.findByCart(cart)).thenReturn(List.of(existing));

        CartResponse response = cartService.addToCart(request);

        assertEquals(5, existing.getQuantity());
        assertEquals(5, response.getTotalItems());
        assertEquals(1, response.getDistinctItemCount());
        verify(cartItemRepository).save(existing);
    }

    @Test
    void addToCart_shouldThrowInvalidQuantityWhenQuantityIsZero() {
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(7);
        request.setQuantity(0);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> cartService.addToCart(request));

        assertEquals("Invalid quantity", ex.getMessage());
    }

    @Test
    void addToCart_shouldThrowInsufficientStockWhenRequestedQuantityExceedsAvailableStock() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("customer@example.com", null));

        User user = User.builder().id(2).email("customer@example.com").build();
        Cart cart = Cart.builder().id(10).user(user).build();
        Product product = Product.builder().id(7).stockQuantity(4).isActive(true).build();
        CartItem existing = CartItem.builder().id(31).cart(cart).product(product).quantity(2).build();

        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(7);
        request.setQuantity(3);

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(productRepository.findById(7)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByCartAndProduct(cart, product)).thenReturn(Optional.of(existing));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> cartService.addToCart(request));

        assertEquals("Insufficient stock available", ex.getMessage());
    }

    @Test
    void addToCart_shouldThrowWhenProductIsInactive() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("customer@example.com", null));

        User user = User.builder().id(2).email("customer@example.com").build();
        Cart cart = Cart.builder().id(10).user(user).build();
        Product product = Product.builder().id(7).stockQuantity(10).isActive(false).build();

        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(7);
        request.setQuantity(1);

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(productRepository.findById(7)).thenReturn(Optional.of(product));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> cartService.addToCart(request));

        assertEquals("Product is unavailable", ex.getMessage());
    }
}
