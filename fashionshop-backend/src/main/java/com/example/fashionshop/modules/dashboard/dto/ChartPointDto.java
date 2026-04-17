package com.example.fashionshop.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ChartPointDto {
    private String label;
    private BigDecimal value;
}
