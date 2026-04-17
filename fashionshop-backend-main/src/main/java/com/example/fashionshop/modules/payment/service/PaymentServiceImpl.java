package com.example.fashionshop.modules.payment.service;

import com.example.fashionshop.common.enums.InvoicePaymentStatus;
import com.example.fashionshop.common.enums.OrderStatus;
import com.example.fashionshop.common.enums.PaymentMethod;
import com.example.fashionshop.common.enums.PaymentStatus;
import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.ForbiddenException;
import com.example.fashionshop.common.exception.PaymentCancelledException;
import com.example.fashionshop.common.exception.PaymentGatewayException;
import com.example.fashionshop.common.exception.PaymentStatusLoadException;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.common.util.SecurityUtil;
import com.example.fashionshop.modules.invoice.entity.Invoice;
import com.example.fashionshop.modules.invoice.repository.InvoiceRepository;
import com.example.fashionshop.modules.order.entity.Order;
import com.example.fashionshop.modules.order.repository.OrderRepository;
import com.example.fashionshop.modules.payment.dto.CustomerPaymentStatusResponse;
import com.example.fashionshop.modules.payment.dto.PaymentRequest;
import com.example.fashionshop.modules.payment.dto.PaymentResponse;
import com.example.fashionshop.modules.payment.entity.Payment;
import com.example.fashionshop.modules.payment.gateway.*;
import com.example.fashionshop.modules.payment.mapper.PaymentStatusMapper;
import com.example.fashionshop.modules.payment.repository.PaymentRepository;
import com.example.fashionshop.modules.user.entity.User;
import com.example.fashionshop.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private static final long ORDER_PAYMENT_TTL_MINUTES = 30;

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final PaymentGatewayFactory paymentGatewayFactory;

    // ================= PROCESS PAYMENT =================
    @Override
    @Transactional
    public PaymentResponse processPayment(Integer orderId, PaymentRequest request) {

        User user = getCurrentUser();
        Order order = getOwnedOrderOrThrow(orderId, user.getId());

        validateOrderEligibility(order);

        String idempotencyKey = normalizeIdempotencyKey(request.getIdempotencyKey());

        Payment existing = paymentRepository
                .findTopByOrderAndIdempotencyKeyOrderByIdDesc(order, idempotencyKey)
                .orElse(null);

        if (existing != null) {
            return toResponse(existing, order, "Duplicate payment request", false, null);
        }

        // COD flow
        if (request.getPaymentMethod() == PaymentMethod.COD) {
            Payment payment = paymentRepository.save(Payment.builder()
                    .order(order)
                    .paymentMethod(PaymentMethod.COD)
                    .paymentStatus(PaymentStatus.PENDING)
                    .idempotencyKey(idempotencyKey)
                    .build());

            order.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
            updateInvoiceStatus(order, InvoicePaymentStatus.PENDING);

            return toResponse(payment, order, "Order confirmed with cash on delivery", false, null);
        }

        // Gateway flow
        Payment processing = paymentRepository.save(Payment.builder()
                .order(order)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PROCESSING)
                .idempotencyKey(idempotencyKey)
                .build());

        PaymentGateway gateway = paymentGatewayFactory.getGateway(request.getPaymentMethod());
        GatewayPaymentResult result = gateway.charge(
                GatewayPaymentRequest.builder()
                        .orderId(order.getId())
                        .amount(order.getTotalPrice())
                        .paymentMethod(request.getPaymentMethod())
                        .idempotencyKey(idempotencyKey)
                        .build()
        );

        if (result.getStatus() == GatewayPaymentStatus.FAILED) {
            processing.setPaymentStatus(PaymentStatus.FAILED);
            processing.setFailureReason(result.getMessage());
            paymentRepository.save(processing);
            updateInvoiceStatus(order, InvoicePaymentStatus.FAILED);
            throw new PaymentGatewayException("Payment failed");
        }

        if (result.getStatus() == GatewayPaymentStatus.CANCELLED) {
            processing.setPaymentStatus(PaymentStatus.CANCELLED);
            paymentRepository.save(processing);
            updateInvoiceStatus(order, InvoicePaymentStatus.PENDING);
            throw new PaymentCancelledException("Payment cancelled");
        }

        processing.setPaymentStatus(PaymentStatus.PAID);
        processing.setPaidAt(LocalDateTime.now());
        processing.setGatewayTransactionId(result.getTransactionId());
        paymentRepository.save(processing);

        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
        updateInvoiceStatus(order, InvoicePaymentStatus.PAID);

        return toResponse(processing, order, "Payment successful", false, result.getRedirectUrl());
    }

    // ================= STATUS =================
    @Override
    public CustomerPaymentStatusResponse getCustomerPaymentStatus(Integer orderId) {
        try {
            User user = getCurrentUser();
            Order order = getOwnedOrderOrThrow(orderId, user.getId());
            Payment payment = paymentRepository.findTopByOrderOrderByIdDesc(order).orElse(null);
            return PaymentStatusMapper.toCustomerResponse(order, payment);
        } catch (ResourceNotFoundException | ForbiddenException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new PaymentStatusLoadException(ex);
        }
    }

    // ================= MISSING INTERFACE METHODS =================
    @Override
    public PaymentResponse getPaymentStatus(Integer orderId) {
        User user = getCurrentUser();
        Order order = getOwnedOrderOrThrow(orderId, user.getId());
        Payment payment = paymentRepository.findTopByOrderOrderByIdDesc(order)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order " + orderId));
        return toResponse(payment, order, "Payment status fetched", false, null);
    }

    @Override
    public PaymentResponse processPayment(PaymentRequest request) {
        throw new UnsupportedOperationException("Deprecated: use processPayment(Integer orderId, PaymentRequest) instead");
    }

    // ================= HELPERS =================
    private void validateOrderEligibility(Order order) {
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cancelled order cannot be paid");
        }

        if (order.getCreatedAt().plusMinutes(ORDER_PAYMENT_TTL_MINUTES).isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Checkout session has expired");
        }

        boolean alreadyPaid = paymentRepository.existsByOrderAndPaymentStatusIn(
                order, List.of(PaymentStatus.PAID)
        );

        if (alreadyPaid) {
            throw new BadRequestException("Order already paid");
        }
    }

    private void updateInvoiceStatus(Order order, InvoicePaymentStatus status) {
        Invoice invoice = invoiceRepository.findByOrder(order)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
        invoice.setPaymentStatus(status);
        invoiceRepository.save(invoice);
    }

    private PaymentResponse toResponse(Payment payment,
                                       Order order,
                                       String message,
                                       boolean retryable,
                                       String redirectUrl) {

        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .orderId(order.getId())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .orderStatus(order.getStatus())
                .message(message)
                .retryable(retryable)
                .redirectUrl(redirectUrl)
                .paidAt(payment.getPaidAt())
                .build();
    }

    private Order getOwnedOrderOrThrow(Integer orderId, Integer userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Access denied");
        }
        return order;
    }

    private String normalizeIdempotencyKey(String key) {
        return (key == null || key.isBlank()) ? UUID.randomUUID().toString() : key.trim();
    }

    private User getCurrentUser() {
        return userRepository.findByEmail(SecurityUtil.getCurrentUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}