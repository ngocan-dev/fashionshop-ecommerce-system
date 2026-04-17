package com.example.fashionshop.modules.cart.repository;

import com.example.fashionshop.modules.cart.entity.Cart;
import com.example.fashionshop.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByUser(User user);
}
