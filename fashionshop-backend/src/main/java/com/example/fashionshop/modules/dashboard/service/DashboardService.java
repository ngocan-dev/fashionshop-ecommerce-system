package com.example.fashionshop.modules.dashboard.service;

import com.example.fashionshop.modules.dashboard.dto.DashboardResponse;

import java.time.LocalDate;

public interface DashboardService {
    DashboardResponse getDashboard(LocalDate from, LocalDate to);
}
