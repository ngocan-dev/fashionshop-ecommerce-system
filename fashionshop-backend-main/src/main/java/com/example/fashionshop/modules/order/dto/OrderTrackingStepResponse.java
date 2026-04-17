package com.example.fashionshop.modules.order.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OrderTrackingStepResponse {
    private String code;
    private String label;
    private Boolean completed;
    private Boolean current;
    private LocalDateTime updatedAt;
}
