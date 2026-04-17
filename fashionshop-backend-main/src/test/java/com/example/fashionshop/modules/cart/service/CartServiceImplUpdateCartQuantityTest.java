package com.example.fashionshop.modules.cart.service;

import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.modules.cart.dto.CartResponse;
import com.example.fashionshop.modules.cart.dto.UpdateCartItemRequest;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceImplUpdateCartQuantityTest {

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
    void updateCartItemQuantity_shouldRecalculateLineSubtotalAndCartTotal() {
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
        CartItem item = CartItem.builder().id(31).cart(cart).product(product).quantity(1).build();

        UpdateCartItemRequest request = new UpdateCartItemRequest();
        request.setQuantity(3);

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findById(31)).thenReturn(Optional.of(item));
        when(productRepository.findById(7)).thenReturn(Optional.of(product));
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(cartItemRepository.findByCart(cart)).thenReturn(List.of(item));

        CartResponse response = cartService.updateCartItemQuantity(31, request);

        assertEquals(3, item.getQuantity());
        assertEquals(new BigDecimal("179.97"), response.getSubtotal());
        assertEquals(new BigDecimal("179.97"), response.getTotalPrice());
        assertEquals(3, response.getTotalItems());
    }

    @Test
    void updateCartItemQuantity_shouldRejectInvalidQuantity() {
        UpdateCartItemRequest request = new UpdateCartItemRequest();
        request.setQuantity(0);

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> cartService.updateCartItemQuantity(31, request));

        assertEquals("Invalid quantity", ex.getMessage());
    }

    @Test
    void updateCartItemQuantity_shouldRejectQuantityBeyondAvailableStock() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("customer@example.com", null));

        User user = User.builder().id(2).email("customer@example.com").build();
        Cart cart = Cart.builder().id(10).user(user).build();
        Product product = Product.builder().id(7).stockQuantity(2).isActive(true).build();
        CartItem item = CartItem.builder().id(31).cart(cart).product(product).quantity(1).build();

        UpdateCartItemRequest request = new UpdateCartItemRequest();
        request.setQuantity(3);

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findById(31)).thenReturn(Optional.of(item));
        when(productRepository.findById(7)).thenReturn(Optional.of(product));

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> cartService.updateCartItemQuantity(31, request));

        assertEquals("Insufficient stock available", ex.getMessage());
    }

    @Test
    void updateCartItemQuantity_shouldRejectItemOutsideCurrentCustomerCart() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("customer@example.com", null));

        User user = User.builder().id(2).email("customer@example.com").build();
        User otherUser = User.builder().id(3).email("other@example.com").build();
        Cart customerCart = Cart.builder().id(10).user(user).build();
        Cart otherCart = Cart.builder().id(11).user(otherUser).build();
        Product product = Product.builder().id(7).stockQuantity(10).isActive(true).build();
        CartItem item = CartItem.builder().id(31).cart(otherCart).product(product).quantity(1).build();

        UpdateCartItemRequest request = new UpdateCartItemRequest();
        request.setQuantity(2);

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(customerCart));
        when(cartItemRepository.findById(31)).thenReturn(Optional.of(item));

        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class,
                () -> cartService.updateCartItemQuantity(31, request));

        assertEquals("Item not found in cart", ex.getMessage());
    }
}
