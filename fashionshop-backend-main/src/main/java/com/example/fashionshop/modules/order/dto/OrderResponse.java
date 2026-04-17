package com.example.fashionshop.modules.order.dto;

import com.example.fashionshop.common.enums.OrderStatus;
import com.example.fashionshop.common.enums.PaymentMethod;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Integer id;
    private OrderStatus status;
    private BigDecimal totalPrice;
    private String receiverName;
    private String phone;
    private String shippingAddress;
    private String customerNote;
    private PaymentMethod paymentMethod;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private String detailPath;
    private List<OrderItemResponse> items;
}
