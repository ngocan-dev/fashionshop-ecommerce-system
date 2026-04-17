package com.example.fashionshop.modules.order.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderCustomerInfoResponse {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String shippingAddress;
    private String deliveryNote;
    private String billingAddress;
}
