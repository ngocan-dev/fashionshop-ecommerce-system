package com.example.fashionshop.modules.order.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OrderAdditionalInfoResponse {
    private String customerNote;
    private String deliveryMethod;
    private String internalNote;
    private LocalDateTime estimatedDeliveryDate;
    private Boolean cancelled;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdatedAt;
}
