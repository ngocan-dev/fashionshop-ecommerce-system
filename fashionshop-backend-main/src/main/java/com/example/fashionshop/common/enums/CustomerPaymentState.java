package com.example.fashionshop.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum CustomerPaymentState {
    PENDING("pending"),
    PAID("paid"),
    FAILED("failed"),
    CANCELLED("cancelled");

    private final String value;

    CustomerPaymentState(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
