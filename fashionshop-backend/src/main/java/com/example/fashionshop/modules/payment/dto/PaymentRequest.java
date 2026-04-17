package com.example.fashionshop.modules.payment.dto;

import com.example.fashionshop.common.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @Size(max = 128, message = "Idempotency key must be at most 128 characters")
    private String idempotencyKey;

    @Size(max = 120, message = "Card holder name must be at most 120 characters")
    private String cardHolderName;

    @Size(max = 19, message = "Card number must be at most 19 characters")
    private String cardNumber;

    @Size(max = 2, message = "Expiry month must be 2 digits")
    private String expiryMonth;

    @Size(max = 2, message = "Expiry year must be 2 digits")
    private String expiryYear;

    @Size(max = 4, message = "CVV must be at most 4 digits")
    private String cvv;

    @Size(max = 255, message = "Return URL must be at most 255 characters")
    private String returnUrl;

    private boolean cancelledByUser;
}
