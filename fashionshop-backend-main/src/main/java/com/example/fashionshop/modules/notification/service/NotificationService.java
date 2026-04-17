package com.example.fashionshop.modules.notification.service;

public interface NotificationService {
    void sendOrderNotification(Integer userId, String message);
}
