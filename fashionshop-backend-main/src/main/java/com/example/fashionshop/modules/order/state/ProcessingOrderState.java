package com.example.fashionshop.modules.order.state;

import com.example.fashionshop.common.enums.OrderStatus;

import java.util.EnumSet;
import java.util.Set;

public class ProcessingOrderState implements OrderState {

    @Override
    public OrderStatus getStatus() {
        return OrderStatus.PROCESSING;
    }

    @Override
    public Set<OrderStatus> allowedTransitions() {
        return EnumSet.of(OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.CANCELLED);
    }
}
