package com.example.fashionshop.modules.payment.gateway;

import com.example.fashionshop.common.enums.PaymentMethod;
import com.example.fashionshop.common.exception.BadRequestException;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PaymentGatewayFactory {

    private final Map<PaymentMethod, PaymentGateway> gatewayByMethod;

    public PaymentGatewayFactory(java.util.List<PaymentGateway> gateways) {
        this.gatewayByMethod = gateways.stream()
                .collect(Collectors.toMap(PaymentGateway::supportedMethod, Function.identity()));
    }

    public PaymentGateway getGateway(PaymentMethod method) {
        PaymentGateway gateway = gatewayByMethod.get(method);
        if (gateway == null) {
            throw new BadRequestException("Selected payment method is not supported for online payment");
        }
        return gateway;
    }
}
