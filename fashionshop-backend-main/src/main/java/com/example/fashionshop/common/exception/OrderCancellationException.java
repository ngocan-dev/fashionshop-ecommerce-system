package com.example.fashionshop.common.exception;

public class OrderCancellationException extends RuntimeException {
    public OrderCancellationException() {
        super("Order cancellation failed");
    }

    public OrderCancellationException(String message) {
        super(message);
    }
}
