package com.example.fashionshop.modules.order.dto;

import com.example.fashionshop.common.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PlaceOrderRequest {
    @NotBlank(message = "Receiver name is required")
    @Size(max = 100, message = "Receiver name must be at most 100 characters")
    private String receiverName;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^(\\+?[0-9]{9,15})$", message = "Phone number is invalid")
    private String phone;

    @NotBlank(message = "Shipping address is required")
    @Size(max = 255, message = "Shipping address must be at most 255 characters")
    private String shippingAddress;

    @Size(max = 100, message = "City must be at most 100 characters")
    private String city;

    @Size(max = 100, message = "District must be at most 100 characters")
    private String district;

    @Size(max = 100, message = "Province must be at most 100 characters")
    private String province;

    @Size(max = 20, message = "Postal code must be at most 20 characters")
    private String postalCode;

    @Size(max = 500, message = "Order note must be at most 500 characters")
    private String note;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}
