package com.example.fashionshop.modules.order.repository;

import com.example.fashionshop.common.enums.OrderStatus;
import com.example.fashionshop.common.enums.Role;
import com.example.fashionshop.modules.order.entity.Order;
import com.example.fashionshop.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer>, JpaSpecificationExecutor<Order> {
    List<Order> findByUser(User user);

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    Optional<Order> findByIdAndUserId(Integer id, Integer userId);

    long countByStatus(OrderStatus status);

    long countByUserRole(Role role);

    List<Order> findByStatus(OrderStatus status);

    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    List<Order> findTop5ByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.status = :status")
    BigDecimal sumRevenueByStatus(@Param("status") OrderStatus status);

    @Query("""
            SELECT COALESCE(SUM(o.totalPrice), 0)
            FROM Order o
            WHERE o.status = :status
              AND o.createdAt BETWEEN :from AND :to
            """)
    BigDecimal sumRevenueByStatusAndCreatedAtBetween(@Param("status") OrderStatus status,
                                                     @Param("from") LocalDateTime from,
                                                     @Param("to") LocalDateTime to);

    @Query("""
            SELECT FUNCTION('DATE', o.createdAt), COUNT(o)
            FROM Order o
            WHERE o.createdAt BETWEEN :from AND :to
            GROUP BY FUNCTION('DATE', o.createdAt)
            ORDER BY FUNCTION('DATE', o.createdAt)
            """)
    List<Object[]> countOrdersGroupedByDay(@Param("from") LocalDateTime from,
                                           @Param("to") LocalDateTime to);

    @Query("""
            SELECT FUNCTION('DATE', o.createdAt), COALESCE(SUM(o.totalPrice), 0)
            FROM Order o
            WHERE o.status = :status
              AND o.createdAt BETWEEN :from AND :to
            GROUP BY FUNCTION('DATE', o.createdAt)
            ORDER BY FUNCTION('DATE', o.createdAt)
            """)
    List<Object[]> sumRevenueGroupedByDay(@Param("status") OrderStatus status,
                                          @Param("from") LocalDateTime from,
                                          @Param("to") LocalDateTime to);

    default BigDecimal totalRevenueFromCompletedOrders(List<Order> completedOrders) {
        return completedOrders.stream().map(Order::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
