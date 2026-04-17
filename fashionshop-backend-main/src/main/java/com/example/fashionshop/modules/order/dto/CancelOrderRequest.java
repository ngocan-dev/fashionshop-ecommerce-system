package com.example.fashionshop.modules.order.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CancelOrderRequest {

    @Size(max = 500, message = "Cancellation reason must be 500 characters or fewer")
    private String reason;
}
