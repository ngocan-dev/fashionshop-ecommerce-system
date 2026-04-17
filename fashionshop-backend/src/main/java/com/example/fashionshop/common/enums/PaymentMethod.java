package com.example.fashionshop.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Locale;

public enum PaymentMethod {
    COD,
    BANKING,
    MOMO,
    VNPAY;

    @JsonCreator
    public static PaymentMethod fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim().toLowerCase(Locale.ROOT).replace("_", "").replace("-", "");
        return switch (normalized) {
            case "cod" -> COD;
            case "epayment", "banking", "banktransfer", "onlinepayment" -> BANKING;
            case "momo" -> MOMO;
            case "vnpay" -> VNPAY;
            default -> throw new IllegalArgumentException("Invalid payment method. Allowed values: COD, E-payment");
        };
    }
}
