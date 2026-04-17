package com.example.fashionshop.common.exception;

public class OrderStatusLoadException extends RuntimeException {
    public OrderStatusLoadException() {
        super("Unable to load order status");
    }

    public OrderStatusLoadException(Throwable cause) {
        super("Unable to load order status", cause);
    }
}
