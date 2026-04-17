package com.example.fashionshop.modules.payment.gateway;

import com.example.fashionshop.common.enums.PaymentMethod;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class MockVnpayPaymentGateway implements PaymentGateway {
    @Override
    public PaymentMethod supportedMethod() {
        return PaymentMethod.VNPAY;
    }

    @Override
    public GatewayPaymentResult charge(GatewayPaymentRequest request) {
        if (request.isCancelledByUser()) {
            return GatewayPaymentResult.builder().status(GatewayPaymentStatus.CANCELLED).message("Payment cancelled by user").build();
        }
        return GatewayPaymentResult.builder()
                .status(GatewayPaymentStatus.SUCCESS)
                .transactionId("vnpay_" + UUID.randomUUID().toString().replace("-", ""))
                .message("Payment successful")
                .redirectUrl(request.getReturnUrl())
                .build();
    }
}
