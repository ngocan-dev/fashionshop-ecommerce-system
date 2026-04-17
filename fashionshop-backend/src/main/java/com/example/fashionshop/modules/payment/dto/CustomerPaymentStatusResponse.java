package com.example.fashionshop.modules.payment.dto;

import com.example.fashionshop.common.enums.CustomerPaymentState;
import com.example.fashionshop.common.enums.OrderStatus;
import com.example.fashionshop.common.enums.PaymentMethod;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CustomerPaymentStatusResponse {
    private Integer orderId;
    private String orderCode;
    private OrderStatus orderStatus;
    private BigDecimal orderTotalAmount;

    private boolean paymentInfoAvailable;
    private CustomerPaymentState paymentStatus;
    private PaymentMethod paymentMethod;
    private LocalDateTime paymentDateTime;
    private String transactionReference;
    private BigDecimal paidAmount;

    private String failureReason;
    private String gatewayProvider;
    private LocalDateTime lastUpdatedAt;
    private String refundStatus;

    private boolean retryAllowed;
}
