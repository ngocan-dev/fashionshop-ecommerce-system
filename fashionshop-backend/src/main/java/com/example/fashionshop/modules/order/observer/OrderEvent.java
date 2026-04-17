package com.example.fashionshop.modules.order.observer;

/**
 * Observer Pattern — immutable event object published to all registered {@link OrderEventListener}s
 * whenever an order's lifecycle changes.
 *
 * @param type    the kind of change that occurred
 * @param orderId the affected order
 * @param userId  the user that owns the order (may be {@code null} for system events)
 * @param message a human-readable description of the event
 */
public record OrderEvent(
        OrderEventType type,
        Integer orderId,
        Integer userId,
        String message
) {
}
