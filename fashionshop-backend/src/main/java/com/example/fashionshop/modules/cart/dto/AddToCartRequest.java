package com.example.fashionshop.modules.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddToCartRequest {
    @NotNull(message = "Product ID is required")
    private Integer productId;

    @NotNull(message = "Invalid quantity")
    @Min(value = 1, message = "Invalid quantity")
    private Integer quantity;
}
