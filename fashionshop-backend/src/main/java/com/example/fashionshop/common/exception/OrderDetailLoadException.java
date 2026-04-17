package com.example.fashionshop.common.exception;

public class OrderDetailLoadException extends RuntimeException {
    public OrderDetailLoadException() {
        super("Failed to retrieve order details");
    }

    public OrderDetailLoadException(Throwable cause) {
        super("Failed to retrieve order details", cause);
    }
}
