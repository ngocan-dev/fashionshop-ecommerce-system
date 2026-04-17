package com.example.fashionshop.modules.payment.gateway;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class GatewayPaymentResult {
    GatewayPaymentStatus status;
    String transactionId;
    String redirectUrl;
    String message;

    public boolean isSuccess() {
        return status == GatewayPaymentStatus.SUCCESS;
    }
}
