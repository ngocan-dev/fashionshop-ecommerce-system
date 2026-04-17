package com.example.fashionshop.common.exception;

public class PaymentCancelledException extends RuntimeException {
    public PaymentCancelledException(String message) {
        super(message);
    }
}
