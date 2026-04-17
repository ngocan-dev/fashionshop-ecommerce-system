package com.example.fashionshop.modules.order.dto;

import com.example.fashionshop.common.enums.PaymentMethod;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CheckoutSummaryResponse {
    private Integer cartId;
    private Boolean empty;
    private String message;
    private String customerName;
    private String customerPhone;
    private String suggestedShippingAddress;
    private List<PaymentMethod> availablePaymentMethods;
    private PaymentMethod selectedPaymentMethod;
    private List<CheckoutSummaryItemResponse> items;
    private Integer totalItems;
    private Integer distinctItemCount;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal finalTotal;
}
