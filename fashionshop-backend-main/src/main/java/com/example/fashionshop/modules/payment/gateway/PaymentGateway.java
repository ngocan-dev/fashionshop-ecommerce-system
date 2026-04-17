package com.example.fashionshop.modules.payment.gateway;

import com.example.fashionshop.common.enums.PaymentMethod;

public interface PaymentGateway {
    PaymentMethod supportedMethod();

    GatewayPaymentResult charge(GatewayPaymentRequest request);
}
