package com.example.fashionshop.modules.order.observer;

/**
 * Observer Pattern — Subject interface.
 * Decouples publishers (order service) from the full list of listeners.
 */
public interface OrderEventPublisher {
    void publish(OrderEvent event);
}
