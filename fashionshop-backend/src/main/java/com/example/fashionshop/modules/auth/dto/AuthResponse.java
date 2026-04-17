package com.example.fashionshop.modules.auth.dto;

import com.example.fashionshop.common.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private Integer userId;
    private String fullName;
    private String email;
    private Role role;
}
