package com.example.fashionshop.modules.user.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.modules.user.dto.CustomerAccountResponse;
import com.example.fashionshop.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/customer-accounts")
@RequiredArgsConstructor
public class AdminCustomerAccountController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<CustomerAccountResponse>> getCustomerAccounts() {
        List<CustomerAccountResponse> customerAccounts = userService.getAllCustomerAccounts();
        if (customerAccounts.isEmpty()) {
            return ApiResponse.success("No customer accounts found", customerAccounts);
        }
        return ApiResponse.success("Customer accounts retrieved successfully", customerAccounts);
    }
}
