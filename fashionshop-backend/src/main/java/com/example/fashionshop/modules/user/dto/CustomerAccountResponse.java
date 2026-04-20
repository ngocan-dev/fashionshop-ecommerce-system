package com.example.fashionshop.modules.user.dto;

import com.example.fashionshop.common.enums.Role;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class CustomerAccountResponse {
    private Integer id;
    private String fullName;
    private String email;
    private Role role;
    private String status;
    private Integer totalOrders;
    private BigDecimal totalSpend;
}
