package com.example.fashionshop.modules.order.observer.listener;

import com.example.fashionshop.modules.order.observer.OrderEvent;
import com.example.fashionshop.modules.order.observer.OrderEventListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Observer Pattern — concrete Observer that writes every order event to the application log.
 * Runs first (lowest order value) so audit entries appear before side-effects.
 */
@Component
@Order(1)
@Slf4j
public class LogOrderEventListener implements OrderEventListener {

    @Override
    public void onOrderEvent(OrderEvent event) {
        log.info("[OrderEvent] type={} orderId={} userId={} message={}",
                event.type(), event.orderId(), event.userId(), event.message());
    }
}
