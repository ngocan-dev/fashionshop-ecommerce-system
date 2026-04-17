package com.example.fashionshop.modules.cart.service;

import com.example.fashionshop.common.exception.CartLoadException;
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
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceImplGetCartTest {

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
    void getMyCart_shouldReturnCalculatedSummaryForActiveItems() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("customer@example.com", null));

        User user = User.builder().id(2).email("customer@example.com").build();
        Cart cart = Cart.builder().id(10).user(user).build();
        Product shirt = Product.builder()
                .id(7)
                .name("Classic Shirt")
                .imageUrl("https://cdn.example.com/shirt.jpg")
                .price(new BigDecimal("59.99"))
                .build();
        Product jeans = Product.builder()
                .id(8)
                .name("Blue Jeans")
                .imageUrl("https://cdn.example.com/jeans.jpg")
                .price(new BigDecimal("40.00"))
                .build();
        CartItem shirtItem = CartItem.builder().id(31).cart(cart).product(shirt).quantity(2).build();
        CartItem jeansItem = CartItem.builder().id(32).cart(cart).product(jeans).quantity(1).build();

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCart(cart)).thenReturn(List.of(shirtItem, jeansItem));

        CartResponse response = cartService.getMyCart();

        assertEquals(3, response.getTotalItems());
        assertEquals(2, response.getDistinctItemCount());
        assertEquals(new BigDecimal("159.98"), response.getSubtotal());
        assertEquals(new BigDecimal("159.98"), response.getTotalPrice());
        assertEquals(false, response.getEmpty());
        assertEquals(2, response.getItems().size());
    }

    @Test
    void getMyCart_shouldThrowCartLoadExceptionWhenRepositoryFails() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("customer@example.com", null));

        User user = User.builder().id(2).email("customer@example.com").build();

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenThrow(new DataRetrievalFailureException("db down"));

        CartLoadException ex = assertThrows(CartLoadException.class, () -> cartService.getMyCart());

        assertEquals("Unable to load cart items", ex.getMessage());
    }
}
