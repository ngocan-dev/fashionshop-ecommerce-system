package com.example.fashionshop.modules.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StaffAccountResponse {
    private Integer id;
    private String fullName;
    private String email;
    private String role;
    private String status;
}
