package com.example.fashionshop.modules.order.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponse {
    private Integer productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;
}
