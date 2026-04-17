package com.example.fashionshop.modules.order.state;

import com.example.fashionshop.common.enums.OrderStatus;

/**
 * State Pattern — factory that resolves the correct {@link OrderState} for a given {@link OrderStatus}.
 * Callers obtain a state object and then query it for allowed transitions instead of
 * consulting a global map.
 */
public final class OrderStateFactory {

    private OrderStateFactory() {
    }

    public static OrderState of(OrderStatus status) {
        return switch (status) {
            case PENDING    -> new PendingOrderState();
            case CONFIRMED  -> new ConfirmedOrderState();
            case PROCESSING -> new ProcessingOrderState();
            case SHIPPED    -> new ShippedOrderState();
            case DELIVERED  -> new DeliveredOrderState();
            case COMPLETED  -> new CompletedOrderState();
            case CANCELLED  -> new CancelledOrderState();
        };
    }
}
