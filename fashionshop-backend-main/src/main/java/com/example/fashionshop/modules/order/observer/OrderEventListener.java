package com.example.fashionshop.modules.order.observer;

/**
 * Observer Pattern — Observer interface.
 * Implement this interface and register the bean with Spring to receive order lifecycle events.
 */
public interface OrderEventListener {
    void onOrderEvent(OrderEvent event);
}
