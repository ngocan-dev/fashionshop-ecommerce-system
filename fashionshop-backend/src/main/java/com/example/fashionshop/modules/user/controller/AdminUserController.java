package com.example.fashionshop.modules.user.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.modules.user.dto.CreateStaffRequest;
import com.example.fashionshop.modules.user.dto.UpdateStaffRequest;
import com.example.fashionshop.modules.user.dto.UserResponse;
import com.example.fashionshop.modules.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @PostMapping("/staff")
    public ApiResponse<UserResponse> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        return ApiResponse.success("Staff account created successfully", userService.createStaff(request));
    }

    @GetMapping("/staff")
    public ApiResponse<List<UserResponse>> getStaffAccounts() {
        return ApiResponse.success("Staff accounts fetched successfully", userService.getStaffAccounts());
    }

    @GetMapping("/customers")
    public ApiResponse<List<UserResponse>> getCustomerAccounts() {
        return ApiResponse.success("Customer accounts fetched successfully", userService.getCustomerAccounts());
    }

    @PutMapping("/staff/{userId}")
    public ApiResponse<UserResponse> updateStaff(@PathVariable Integer userId,
                                                  @Valid @RequestBody UpdateStaffRequest request) {
        return ApiResponse.success("Staff account updated successfully", userService.updateStaff(userId, request));
    }

    @PatchMapping("/{userId}/activate")
    public ApiResponse<Void> activateUser(@PathVariable Integer userId) {
        userService.activateUser(userId);
        return ApiResponse.success("User activated successfully", null);
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<Void> deactivateUser(@PathVariable Integer userId) {
        userService.deactivateUser(userId);
        return ApiResponse.success("User deactivated successfully", null);
    }
}
