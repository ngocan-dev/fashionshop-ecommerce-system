package com.example.fashionshop.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardUserStatsDto {
    private long totalUsers;
    private long totalStaff;
    private long totalCustomers;
    private long activeUsers;
    private long inactiveUsers;
}
