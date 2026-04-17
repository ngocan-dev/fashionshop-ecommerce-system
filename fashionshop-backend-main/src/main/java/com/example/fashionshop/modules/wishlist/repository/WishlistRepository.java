package com.example.fashionshop.modules.wishlist.repository;

import com.example.fashionshop.modules.product.entity.Product;
import com.example.fashionshop.modules.user.entity.User;
import com.example.fashionshop.modules.wishlist.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    List<Wishlist> findByUser(User user);

    Optional<Wishlist> findByUserAndProduct(User user, Product product);

    boolean existsByUserAndProduct(User user, Product product);

    int countByUser(User user);
}
