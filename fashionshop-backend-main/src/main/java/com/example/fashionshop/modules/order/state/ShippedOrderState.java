package com.example.fashionshop.modules.order.state;

import com.example.fashionshop.common.enums.OrderStatus;

import java.util.EnumSet;
import java.util.Set;

public class ShippedOrderState implements OrderState {

    @Override
    public OrderStatus getStatus() {
        return OrderStatus.SHIPPED;
    }

    @Override
    public Set<OrderStatus> allowedTransitions() {
        return EnumSet.of(OrderStatus.SHIPPED, OrderStatus.DELIVERED);
    }
}
