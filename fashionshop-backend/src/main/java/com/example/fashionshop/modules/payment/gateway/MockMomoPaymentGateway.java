package com.example.fashionshop.modules.payment.gateway;

import com.example.fashionshop.common.enums.PaymentMethod;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class MockMomoPaymentGateway implements PaymentGateway {
    @Override
    public PaymentMethod supportedMethod() {
        return PaymentMethod.MOMO;
    }

    @Override
    public GatewayPaymentResult charge(GatewayPaymentRequest request) {
        if (request.isCancelledByUser()) {
            return GatewayPaymentResult.builder().status(GatewayPaymentStatus.CANCELLED).message("Payment cancelled by user").build();
        }
        return GatewayPaymentResult.builder()
                .status(GatewayPaymentStatus.SUCCESS)
                .transactionId("momo_" + UUID.randomUUID().toString().replace("-", ""))
                .message("Payment successful")
                .build();
    }
}
