package com.example.fashionshop.modules.order.dto;

import com.example.fashionshop.common.enums.OrderStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class OrderListQuery {
    @Min(0)
    private int page = 0;

    @Min(1)
    @Max(100)
    private int size = 10;

    private OrderStatus status;
    private String keyword;
    private String sortBy = "createdAt";
    private String sortDir = "desc";
}
