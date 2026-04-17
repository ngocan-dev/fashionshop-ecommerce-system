package com.example.fashionshop.modules.cart.service;

import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.CartLoadException;
import com.example.fashionshop.common.exception.CartUpdateException;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.common.util.SecurityUtil;
import com.example.fashionshop.modules.cart.dto.AddToCartRequest;
import com.example.fashionshop.modules.cart.dto.CartItemResponse;
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
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private static final String INVALID_QUANTITY_MESSAGE = "Invalid quantity";
    private static final String INSUFFICIENT_STOCK_MESSAGE = "Insufficient stock available";

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public CartResponse getMyCart() {
        try {
            Cart cart = getOrCreateCart();
            return buildCartResponse(cart);
        } catch (DataAccessException ex) {
            throw new CartLoadException("Unable to load cart items", ex);
        }
    }

    @Override
    public CartResponse addToCart(AddToCartRequest request) {
        validateQuantity(request.getQuantity());

        Cart cart = getOrCreateCart();
        Product product = findValidProduct(request.getProductId());
        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(CartItem.builder().cart(cart).product(product).quantity(0).build());

        int requestedQuantity = request.getQuantity();
        int mergedQuantity = item.getQuantity() + requestedQuantity;
        validateStock(product, mergedQuantity);

        item.setQuantity(mergedQuantity);
        return persistAndBuildCart(cart, item, "Unable to add item to cart");
    }

    @Override
    public CartResponse updateCartItem(Integer itemId, UpdateCartItemRequest request) {
        return updateCartItemQuantity(itemId, request);
    }

    @Override
    public CartResponse updateCartItemQuantity(Integer itemId, UpdateCartItemRequest request) {
        validateCartItemId(itemId);
        validateQuantity(request.getQuantity());

        Cart cart = getCurrentCartOrThrow();
        CartItem item = getCartItemOrThrow(cart, itemId);

        Product product = findValidProduct(item.getProduct().getId());
        validateStock(product, request.getQuantity());

        item.setQuantity(request.getQuantity());
        return persistAndBuildCart(cart, item, "Unable to update cart");
    }

    @Override
    public CartResponse removeCartItem(Integer itemId) {
        validateCartItemId(itemId);
        Cart cart = getCurrentCartOrThrow();
        CartItem item = getCartItemOrThrow(cart, itemId);

        try {
            cartItemRepository.delete(item);
            cartItemRepository.flush();
            return buildCartResponse(cart);
        } catch (DataAccessException ex) {
            throw new CartUpdateException("Unable to update cart", ex);
        }
    }

    private CartResponse persistAndBuildCart(Cart cart, CartItem item, String fallbackErrorMessage) {
        try {
            cartItemRepository.save(item);
            return buildCartResponse(cart);
        } catch (DataAccessException ex) {
            throw new CartUpdateException(fallbackErrorMessage, ex);
        }
    }

    private Cart getOrCreateCart() {
        User user = getCurrentUser();
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    private Cart getCurrentCartOrThrow() {
        User user = getCurrentUser();
        return cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    private CartItem getCartItemOrThrow(Cart cart, Integer itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in cart"));
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Item not found in cart");
        }
        return item;
    }

    private void validateCartItemId(Integer itemId) {
        if (itemId == null || itemId <= 0) {
            throw new BadRequestException("Invalid cart item id");
        }
    }

    private User getCurrentUser() {
        String email = SecurityUtil.getCurrentUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    private Product findValidProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!Boolean.TRUE.equals(product.getIsActive())
                || product.getStockQuantity() == null
                || product.getStockQuantity() <= 0) {
            throw new BadRequestException("Product is unavailable");
        }

        return product;
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new BadRequestException(INVALID_QUANTITY_MESSAGE);
        }
    }

    private void validateStock(Product product, int requestedQuantity) {
        Integer availableStock = product.getStockQuantity();
        if (availableStock == null || requestedQuantity > availableStock) {
            throw new BadRequestException(INSUFFICIENT_STOCK_MESSAGE);
        }
    }

    private CartResponse buildCartResponse(Cart cart) {
        List<CartItemResponse> items = cartItemRepository.findByCart(cart).stream().map(item -> {
            BigDecimal lineTotal = item.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));

            return CartItemResponse.builder()
                    .itemId(item.getId())
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .productImage(item.getProduct().getImageUrl())
                    .price(item.getProduct().getPrice())
                    .quantity(item.getQuantity())
                    .lineTotal(lineTotal)
                    .build();
        }).toList();

        BigDecimal subtotal = items.stream()
                .map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalItems(totalItems)
                .distinctItemCount(items.size())
                .subtotal(subtotal)
                .totalPrice(subtotal)
                .empty(items.isEmpty())
                .build();
    }
}
