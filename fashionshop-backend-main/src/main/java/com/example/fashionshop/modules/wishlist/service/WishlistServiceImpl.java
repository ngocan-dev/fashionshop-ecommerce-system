package com.example.fashionshop.modules.wishlist.service;

import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.common.exception.WishlistUpdateException;
import com.example.fashionshop.common.util.SecurityUtil;
import com.example.fashionshop.modules.product.entity.Product;
import com.example.fashionshop.modules.product.repository.ProductRepository;
import com.example.fashionshop.modules.user.entity.User;
import com.example.fashionshop.modules.user.repository.UserRepository;
import com.example.fashionshop.modules.wishlist.dto.AddWishlistItemRequest;
import com.example.fashionshop.modules.wishlist.dto.AddWishlistItemResponse;
import com.example.fashionshop.modules.wishlist.dto.WishlistItemResponse;
import com.example.fashionshop.modules.wishlist.dto.WishlistResponse;
import com.example.fashionshop.modules.wishlist.entity.Wishlist;
import com.example.fashionshop.modules.wishlist.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<WishlistResponse> getMyWishlist() {
        User user = getCurrentUser();
        return wishlistRepository.findByUser(user).stream().map(w -> WishlistResponse.builder()
                .wishlistId(w.getId())
                .productId(w.getProduct().getId())
                .productName(w.getProduct().getName())
                .price(w.getProduct().getPrice())
                .imageUrl(w.getProduct().getImageUrl())
                .build()).toList();
    }

    @Override
    public AddWishlistItemResponse addToWishlist(AddWishlistItemRequest request) {
        validateProductId(request == null ? null : request.getProductId());

        User user = getCurrentUser();
        Product product = findProductOrThrow(request.getProductId());

        return wishlistRepository.findByUserAndProduct(user, product)
                .map(existing -> buildAddResponse(user, existing, true))
                .orElseGet(() -> createWishlistItem(user, product));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isProductInWishlist(Integer productId) {
        validateProductId(productId);

        User user = getCurrentUser();
        Product product = findProductOrThrow(productId);

        return wishlistRepository.existsByUserAndProduct(user, product);
    }

    @Override
    public void removeFromWishlist(Integer productId) {
        validateProductId(productId);

        User user = getCurrentUser();
        Product product = findProductOrThrow(productId);
        Wishlist wishlist = wishlistRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item not found"));
        try {
            wishlistRepository.delete(wishlist);
            wishlistRepository.flush();
        } catch (DataAccessException ex) {
            throw new WishlistUpdateException("Unable to update wishlist", ex);
        }
    }

    private AddWishlistItemResponse createWishlistItem(User user, Product product) {
        try {
            Wishlist saved = wishlistRepository.save(Wishlist.builder().user(user).product(product).build());
            return buildAddResponse(user, saved, false);
        } catch (DataAccessException ex) {
            throw new WishlistUpdateException("Unable to add product to wishlist", ex);
        }
    }

    private AddWishlistItemResponse buildAddResponse(User user, Wishlist wishlist, boolean alreadyInWishlist) {
        return AddWishlistItemResponse.builder()
                .alreadyInWishlist(alreadyInWishlist)
                .wishlistCount(wishlistRepository.countByUser(user))
                .item(WishlistItemResponse.builder()
                        .wishlistId(wishlist.getId())
                        .productId(wishlist.getProduct().getId())
                        .productName(wishlist.getProduct().getName())
                        .price(wishlist.getProduct().getPrice())
                        .imageUrl(wishlist.getProduct().getImageUrl())
                        .createdAt(wishlist.getCreatedAt())
                        .build())
                .build();
    }

    private Product findProductOrThrow(Integer productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private void validateProductId(Integer productId) {
        if (productId == null || productId <= 0) {
            throw new BadRequestException("Invalid product id");
        }
    }

    private User getCurrentUser() {
        String email = SecurityUtil.getCurrentUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }
}
