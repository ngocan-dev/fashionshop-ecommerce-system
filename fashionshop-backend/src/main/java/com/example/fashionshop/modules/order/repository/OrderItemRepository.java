package com.example.fashionshop.modules.order.repository;

import com.example.fashionshop.modules.order.entity.Order;
import com.example.fashionshop.modules.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrder(Order order);
}
