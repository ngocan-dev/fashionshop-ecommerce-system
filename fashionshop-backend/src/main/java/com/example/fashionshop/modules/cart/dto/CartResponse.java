package com.example.fashionshop.modules.cart.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartResponse {
    private Integer cartId;
    private List<CartItemResponse> items;

    private Integer totalItems;          // tổng số lượng item (sum quantity)
    private Integer distinctItemCount;  // số loại sản phẩm khác nhau

    private BigDecimal subtotal;        // tổng tiền trước xử lý thêm
    private BigDecimal totalPrice;      // tổng tiền cuối cùng

    private Boolean empty;
}