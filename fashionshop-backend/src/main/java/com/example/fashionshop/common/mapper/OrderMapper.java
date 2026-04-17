package com.example.fashionshop.common.mapper;

import com.example.fashionshop.modules.invoice.entity.Invoice;
import com.example.fashionshop.modules.order.dto.*;
import com.example.fashionshop.modules.order.entity.Order;
import com.example.fashionshop.modules.order.entity.OrderItem;
import com.example.fashionshop.modules.payment.entity.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public final class OrderMapper {

    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private OrderMapper() {
    }

    public static OrderResponse toResponse(Order order, List<OrderItem> items, Optional<Payment> latestPayment) {
        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .receiverName(order.getReceiverName())
                .phone(order.getPhone())
                .shippingAddress(order.getShippingAddress())
                .customerNote(order.getCustomerNote())
                .paymentMethod(latestPayment.map(Payment::getPaymentMethod).orElse(null))
                .cancellationReason(order.getCancellationReason())
                .createdAt(order.getCreatedAt())
                .detailPath("/account/orders/" + order.getId())
                .items(items.stream().map(OrderMapper::toItemResponse).toList())
                .build();
    }

    public static OrderDetailResponse toDetailResponse(Order order,
                                                       List<OrderItem> items,
                                                       Optional<Invoice> invoice,
                                                       Optional<Payment> latestPayment) {
        BigDecimal subtotal = calculateSubtotal(items);

        return OrderDetailResponse.builder()
                .summary(OrderSummaryResponse.builder()
                        .orderId(order.getId())
                        .orderCode(invoice.map(Invoice::getInvoiceNumber).orElse(null))
                        .orderDate(order.getCreatedAt())
                        .orderStatus(order.getStatus())
                        .paymentStatus(latestPayment.map(payment -> payment.getPaymentStatus().name())
                                .orElseGet(() -> invoice.map(invoiceEntity -> invoiceEntity.getPaymentStatus().name())
                                        .orElse("PENDING")))
                        .paymentMethod(latestPayment.map(payment -> payment.getPaymentMethod().name()).orElse(null))
                        .subtotal(subtotal)
                        .shippingFee(ZERO)
                        .discountAmount(ZERO)
                        .totalAmount(order.getTotalPrice())
                        .build())
                .customer(OrderCustomerInfoResponse.builder()
                        .fullName(order.getUser().getFullName())
                        .email(order.getUser().getEmail())
                        .phoneNumber(order.getPhone())
                        .shippingAddress(order.getShippingAddress())
                        .deliveryNote(null)
                        .billingAddress(null)
                        .build())
                .items(items.stream().map(OrderMapper::toDetailItemResponse).toList())
                .additionalInfo(OrderAdditionalInfoResponse.builder()
                        .customerNote(order.getCustomerNote())
                        .deliveryMethod(null)
                        .internalNote(invoice.map(Invoice::getNote).orElse(null))
                        .estimatedDeliveryDate(null)
                        .cancelled(order.getStatus() != null && "CANCELLED".equals(order.getStatus().name()))
                        .cancellationReason(order.getCancellationReason())
                        .createdAt(order.getCreatedAt())
                        .lastUpdatedAt(resolveLastUpdated(order, latestPayment))
                        .build())
                .tracking(OrderTrackingMapper.toTrackingInfo(order))
                .build();
    }

    private static OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .build();
    }

    private static OrderDetailItemResponse toDetailItemResponse(OrderItem item) {
        BigDecimal unitPrice = item.getPrice() == null ? ZERO : item.getPrice();
        return OrderDetailItemResponse.builder()
                .productId(item.getProduct().getId())
                .productImage(item.getProduct().getImageUrl())
                .productName(item.getProduct().getName())
                .sku(null)
                .quantity(item.getQuantity())
                .unitPrice(unitPrice)
                .lineTotal(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity() == null ? 0 : item.getQuantity())))
                .variant(null)
                .build();
    }

    private static BigDecimal calculateSubtotal(List<OrderItem> items) {
        return items.stream()
                .map(OrderMapper::lineTotal)
                .reduce(ZERO, BigDecimal::add);
    }

    private static BigDecimal lineTotal(OrderItem item) {
        BigDecimal unitPrice = item.getPrice() == null ? ZERO : item.getPrice();
        int quantity = item.getQuantity() == null ? 0 : item.getQuantity();
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    private static LocalDateTime resolveLastUpdated(Order order, Optional<Payment> latestPayment) {
        return order.getUpdatedAt() != null
                ? order.getUpdatedAt()
                : latestPayment.map(Payment::getPaidAt).orElse(order.getCreatedAt());
    }
}
