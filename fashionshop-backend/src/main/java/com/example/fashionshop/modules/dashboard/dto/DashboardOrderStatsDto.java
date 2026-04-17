package com.example.fashionshop.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardOrderStatsDto {
    private long totalOrders;
    private long ordersInRange;
    private long pendingOrders;
    private long confirmedOrders;
    private long completedOrders;
    private long cancelledOrders;
}
