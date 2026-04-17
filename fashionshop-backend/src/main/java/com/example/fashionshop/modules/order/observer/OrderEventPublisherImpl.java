package com.example.fashionshop.modules.order.observer;

import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Observer Pattern — concrete Subject.
 * Spring auto-injects every {@link OrderEventListener} bean registered in the context,
 * so new observers are picked up without changing this class.
 */
@Component
public class OrderEventPublisherImpl implements OrderEventPublisher {

    private final List<OrderEventListener> listeners;

    public OrderEventPublisherImpl(List<OrderEventListener> listeners) {
        this.listeners = listeners;
    }

    @Override
    public void publish(OrderEvent event) {
        for (OrderEventListener listener : listeners) {
            listener.onOrderEvent(event);
        }
    }
}
