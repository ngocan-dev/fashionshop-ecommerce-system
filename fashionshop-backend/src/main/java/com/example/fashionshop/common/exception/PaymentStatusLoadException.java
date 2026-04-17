package com.example.fashionshop.common.exception;

public class PaymentStatusLoadException extends RuntimeException {

    public PaymentStatusLoadException() {
        super("Unable to load payment status");
    }

    public PaymentStatusLoadException(Throwable cause) {
        super("Unable to load payment status", cause);
    }
}
