package com.example.fashionshop.modules.order.dto;

import com.example.fashionshop.common.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OrderStatusHistoryResponse {
    private OrderStatus status;
    private String label;
    private LocalDateTime updatedAt;
    private String note;
}
