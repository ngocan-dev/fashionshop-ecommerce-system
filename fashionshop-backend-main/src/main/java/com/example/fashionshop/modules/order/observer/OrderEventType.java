package com.example.fashionshop.modules.order.observer;

/**
 * Observer Pattern — event types published when an order's lifecycle changes.
 */
public enum OrderEventType {
    ORDER_PLACED,
    STATUS_UPDATED,
    ORDER_CANCELLED
}
