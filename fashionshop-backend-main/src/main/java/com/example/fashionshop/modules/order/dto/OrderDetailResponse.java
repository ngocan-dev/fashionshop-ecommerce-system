package com.example.fashionshop.modules.order.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderDetailResponse {
    private OrderSummaryResponse summary;
    private OrderCustomerInfoResponse customer;
    private List<OrderDetailItemResponse> items;
    private OrderAdditionalInfoResponse additionalInfo;
    private OrderTrackingInfoResponse tracking;
}
