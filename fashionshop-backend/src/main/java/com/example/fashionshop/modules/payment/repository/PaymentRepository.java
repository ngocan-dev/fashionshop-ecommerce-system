package com.example.fashionshop.modules.payment.repository;

import com.example.fashionshop.common.enums.PaymentStatus;
import com.example.fashionshop.modules.order.entity.Order;
import com.example.fashionshop.modules.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findTopByOrderOrderByIdDesc(Order order);

    List<Payment> findByOrder(Order order);

    Optional<Payment> findTopByOrderAndIdempotencyKeyOrderByIdDesc(Order order, String idempotencyKey);

    boolean existsByOrderAndPaymentStatusIn(Order order, List<PaymentStatus> statuses);
}
