package com.example.fashionshop.modules.order.dto;

import com.example.fashionshop.common.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UpdateOrderStatusResponse {
    private Integer orderId;
    private OrderStatus previousStatus;
    private OrderStatus currentStatus;
    private List<OrderStatus> allowedNextStatuses;
    private LocalDateTime updatedAt;
    private Integer updatedByUserId;
}
