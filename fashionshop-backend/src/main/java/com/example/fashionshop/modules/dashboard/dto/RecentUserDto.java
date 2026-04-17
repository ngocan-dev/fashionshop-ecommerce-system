package com.example.fashionshop.modules.dashboard.dto;

import com.example.fashionshop.common.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RecentUserDto {
    private Integer id;
    private String fullName;
    private String email;
    private Role role;
    private LocalDateTime createdAt;
}
