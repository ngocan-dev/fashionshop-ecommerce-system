package com.example.fashionshop.modules.payment.dto;

import com.example.fashionshop.common.enums.OrderStatus;
import com.example.fashionshop.common.enums.PaymentMethod;
import com.example.fashionshop.common.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Integer paymentId;
    private Integer orderId;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private String message;
    private boolean retryable;
    private String orderConfirmationPath;
    private String checkoutPath;
    private String gatewayTransactionId;
    private String redirectUrl;
    private String idempotencyKey;
    private LocalDateTime paidAt;
}
