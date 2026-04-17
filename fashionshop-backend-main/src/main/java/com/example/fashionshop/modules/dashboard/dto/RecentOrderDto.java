package com.example.fashionshop.modules.dashboard.dto;

import com.example.fashionshop.common.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class RecentOrderDto {
    private Integer id;
    private OrderStatus status;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
}
