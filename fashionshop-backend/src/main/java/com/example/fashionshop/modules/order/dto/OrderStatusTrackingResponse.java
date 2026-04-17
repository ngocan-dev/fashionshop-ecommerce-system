package com.example.fashionshop.modules.order.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderStatusTrackingResponse {
    private OrderSummaryResponse summary;
    private OrderTrackingInfoResponse tracking;
}
