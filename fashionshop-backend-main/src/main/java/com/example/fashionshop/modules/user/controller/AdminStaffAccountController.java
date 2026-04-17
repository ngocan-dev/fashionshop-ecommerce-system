package com.example.fashionshop.modules.user.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.modules.user.dto.StaffAccountResponse;
import com.example.fashionshop.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/staff-accounts")
@RequiredArgsConstructor
public class AdminStaffAccountController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<StaffAccountResponse>> getStaffAccounts() {
        List<StaffAccountResponse> staffAccounts = userService.getAllStaffAccounts();
        if (staffAccounts.isEmpty()) {
            return ApiResponse.success("No staff accounts found", staffAccounts);
        }
        return ApiResponse.success("Staff accounts retrieved successfully", staffAccounts);
    }
}
