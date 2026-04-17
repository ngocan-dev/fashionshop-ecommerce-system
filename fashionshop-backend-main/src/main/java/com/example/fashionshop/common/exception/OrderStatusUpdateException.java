package com.example.fashionshop.common.exception;

public class OrderStatusUpdateException extends RuntimeException {
    public OrderStatusUpdateException() {
        super("Order status update failed");
    }

    public OrderStatusUpdateException(Throwable cause) {
        super("Order status update failed", cause);
    }
}
