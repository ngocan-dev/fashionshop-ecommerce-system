package com.example.fashionshop.modules.order.dto;

import com.example.fashionshop.common.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderTrackingInfoResponse {
    private OrderStatus currentStatus;
    private LocalDateTime lastStatusUpdateAt;
    private String shippingTrackingNote;
    private LocalDateTime estimatedDeliveryDate;
    private String cancellationNote;
    private List<OrderTrackingStepResponse> progressSteps;
    private List<OrderStatusHistoryResponse> statusHistory;
}
