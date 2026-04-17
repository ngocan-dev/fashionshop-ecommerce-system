package com.example.fashionshop.modules.order.state;

import com.example.fashionshop.common.enums.OrderStatus;

import java.util.EnumSet;
import java.util.Set;

public class PendingOrderState implements OrderState {

    @Override
    public OrderStatus getStatus() {
        return OrderStatus.PENDING;
    }

    @Override
    public Set<OrderStatus> allowedTransitions() {
        return EnumSet.of(OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.CANCELLED);
    }
}
