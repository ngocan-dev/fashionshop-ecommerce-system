package com.example.fashionshop.modules.user.dto;

import com.example.fashionshop.common.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Integer id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private String avatarUrl;
    private String bio;
    private Role role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
