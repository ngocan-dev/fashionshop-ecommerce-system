package com.example.fashionshop.modules.order.dto;

import com.example.fashionshop.common.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CancelOrderResponse {
    private Integer orderId;
    private OrderStatus status;
    private String cancellationReason;
    private LocalDateTime updatedAt;
}
