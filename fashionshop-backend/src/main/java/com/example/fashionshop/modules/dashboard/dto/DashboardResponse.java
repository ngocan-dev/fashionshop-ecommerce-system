package com.example.fashionshop.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class DashboardResponse {
    private LocalDate fromDate;
    private LocalDate toDate;
    private DashboardUserStatsDto userStats;
    private DashboardOrderStatsDto orderStats;
    private DashboardRevenueStatsDto revenueStats;
    private List<ChartPointDto> orderChart;
    private List<ChartPointDto> revenueChart;
    private List<RecentOrderDto> recentOrders;
    private List<RecentUserDto> recentUsers;
}
