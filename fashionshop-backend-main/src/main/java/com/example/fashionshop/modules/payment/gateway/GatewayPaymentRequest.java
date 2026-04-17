package com.example.fashionshop.modules.payment.gateway;

import com.example.fashionshop.common.enums.PaymentMethod;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class GatewayPaymentRequest {
    Integer orderId;
    Integer customerId;
    PaymentMethod paymentMethod;
    BigDecimal amount;
    String idempotencyKey;
    String cardHolderName;
    String cardNumber;
    String expiryMonth;
    String expiryYear;
    String cvv;
    String returnUrl;
    boolean cancelledByUser;
}
