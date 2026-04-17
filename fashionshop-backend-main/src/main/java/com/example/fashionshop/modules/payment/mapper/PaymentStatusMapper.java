package com.example.fashionshop.modules.payment.mapper;

import com.example.fashionshop.common.enums.CustomerPaymentState;
import com.example.fashionshop.common.enums.OrderStatus;
import com.example.fashionshop.common.enums.PaymentStatus;
import com.example.fashionshop.modules.order.entity.Order;
import com.example.fashionshop.modules.payment.dto.CustomerPaymentStatusResponse;
import com.example.fashionshop.modules.payment.entity.Payment;

import java.math.BigDecimal;

public final class PaymentStatusMapper {

    private PaymentStatusMapper() {
    }

    public static CustomerPaymentStatusResponse toCustomerResponse(Order order, Payment payment) {
        BigDecimal orderTotal = order.getTotalPrice() == null ? BigDecimal.ZERO : order.getTotalPrice();

        if (payment == null) {
            return CustomerPaymentStatusResponse.builder()
                    .orderId(order.getId())
                    .orderCode("ORD-" + order.getId())
                    .orderStatus(order.getStatus())
                    .orderTotalAmount(orderTotal)
                    .paymentInfoAvailable(false)
                    .retryAllowed(false)
                    .lastUpdatedAt(order.getUpdatedAt() != null ? order.getUpdatedAt() : order.getCreatedAt())
                    .build();
        }

        CustomerPaymentState state = toCustomerState(payment, order);

        return CustomerPaymentStatusResponse.builder()
                .orderId(order.getId())
                .orderCode("ORD-" + order.getId())
                .orderStatus(order.getStatus())
                .orderTotalAmount(orderTotal)
                .paymentInfoAvailable(true)
                .paymentStatus(state)
                .paymentMethod(payment.getPaymentMethod())
                .paymentDateTime(payment.getPaidAt())
                .transactionReference(payment.getTransactionReference())
                .paidAmount(payment.getPaidAmount())
                .failureReason(payment.getFailureReason())
                .gatewayProvider(payment.getGatewayProvider())
                .lastUpdatedAt(payment.getUpdatedAt() != null ? payment.getUpdatedAt() : payment.getCreatedAt())
                .refundStatus(null)
                .retryAllowed(state == CustomerPaymentState.FAILED || state == CustomerPaymentState.PENDING)
                .build();
    }

    private static CustomerPaymentState toCustomerState(Payment payment, Order order) {
        if (payment.getPaymentStatus() == PaymentStatus.PAID) {
            return CustomerPaymentState.PAID;
        }

        if (payment.getPaymentStatus() == PaymentStatus.FAILED) {
            return CustomerPaymentState.FAILED;
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            return CustomerPaymentState.CANCELLED;
        }

        return CustomerPaymentState.PENDING;
    }
}
