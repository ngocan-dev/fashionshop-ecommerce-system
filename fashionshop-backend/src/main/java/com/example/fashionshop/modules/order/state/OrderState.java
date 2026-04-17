package com.example.fashionshop.modules.order.state;

import com.example.fashionshop.common.enums.OrderStatus;

import java.util.Set;

/**
 * State Pattern — represents the behaviour of an order at a particular lifecycle step.
 * Each concrete state knows which transitions are legal from itself.
 */
public interface OrderState {

    /** The status value this state represents. */
    OrderStatus getStatus();

    /** Returns the full set of statuses that are reachable from this state. */
    Set<OrderStatus> allowedTransitions();

    /** Returns {@code true} when transitioning to {@code next} is permitted. */
    default boolean canTransitionTo(OrderStatus next) {
        return next != null && allowedTransitions().contains(next);
    }
}
