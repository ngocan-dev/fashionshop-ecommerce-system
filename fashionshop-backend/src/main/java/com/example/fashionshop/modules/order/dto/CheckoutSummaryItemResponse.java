package com.example.fashionshop.modules.order.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CheckoutSummaryItemResponse {
    private Integer itemId;
    private Integer productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
}
