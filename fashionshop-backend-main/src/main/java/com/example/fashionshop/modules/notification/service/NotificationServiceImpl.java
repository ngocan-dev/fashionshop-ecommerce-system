package com.example.fashionshop.modules.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationServiceImpl implements NotificationService {
    @Override
    public void sendOrderNotification(Integer userId, String message) {
        log.info("[Notification] userId={}, message={}", userId, message);
    }
}
