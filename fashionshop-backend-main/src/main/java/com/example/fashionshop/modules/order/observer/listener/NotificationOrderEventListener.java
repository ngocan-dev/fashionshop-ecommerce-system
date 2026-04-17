package com.example.fashionshop.modules.order.observer.listener;

import com.example.fashionshop.modules.notification.service.NotificationService;
import com.example.fashionshop.modules.order.observer.OrderEvent;
import com.example.fashionshop.modules.order.observer.OrderEventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Observer Pattern — concrete Observer that delegates to {@link NotificationService}.
 * Only fires when the event carries a non-null userId (i.e. user-facing events).
 */
@Component
@Order(2)
public class NotificationOrderEventListener implements OrderEventListener {

    private final NotificationService notificationService;

    public NotificationOrderEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public void onOrderEvent(OrderEvent event) {
        if (event.userId() != null) {
            notificationService.sendOrderNotification(event.userId(), event.message());
        }
    }
}
