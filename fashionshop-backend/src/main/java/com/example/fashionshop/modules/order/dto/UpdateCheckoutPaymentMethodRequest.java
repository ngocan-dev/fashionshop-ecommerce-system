package com.example.fashionshop.modules.order.dto;

import com.example.fashionshop.common.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCheckoutPaymentMethodRequest {

    @NotNull(message = "Please select a payment method")
    private PaymentMethod paymentMethod;
}
