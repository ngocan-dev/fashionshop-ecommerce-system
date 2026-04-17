package com.example.fashionshop.modules.payment.gateway;

import com.example.fashionshop.common.enums.PaymentMethod;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class MockOnlinePaymentGateway implements PaymentGateway {

    @Override
    public PaymentMethod supportedMethod() {
        return PaymentMethod.BANKING;
    }

    @Override
    public GatewayPaymentResult charge(GatewayPaymentRequest request) {
        if (request.isCancelledByUser()) {
            return GatewayPaymentResult.builder()
                    .status(GatewayPaymentStatus.CANCELLED)
                    .message("Payment cancelled by user")
                    .build();
        }

        String normalizedCard = request.getCardNumber() == null ? "" : request.getCardNumber().replaceAll("\\s", "");
        if (normalizedCard.endsWith("0000")) {
            return GatewayPaymentResult.builder()
                    .status(GatewayPaymentStatus.FAILED)
                    .message("Payment failed")
                    .build();
        }

        return GatewayPaymentResult.builder()
                .status(GatewayPaymentStatus.SUCCESS)
                .transactionId("txn_" + UUID.randomUUID().toString().replace("-", ""))
                .message("Payment successful")
                .build();
    }
}
