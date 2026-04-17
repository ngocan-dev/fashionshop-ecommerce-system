package com.example.fashionshop.modules.user.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.modules.order.dto.CustomerOrderHistoryQuery;
import com.example.fashionshop.modules.order.dto.OrderSummaryResponse;
import com.example.fashionshop.modules.order.service.OrderService;
import com.example.fashionshop.modules.user.dto.UpdateProfileRequest;
import com.example.fashionshop.modules.user.dto.UserResponse;
import com.example.fashionshop.modules.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
@Validated
public class MeController {

    private final UserService userService;
    private final OrderService orderService;

    @GetMapping
    public ApiResponse<UserResponse> getMyProfile() {
        return ApiResponse.success("Profile fetched successfully", userService.getMyProfile());
    }

    @PutMapping
    public ApiResponse<UserResponse> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.success("Profile updated successfully", userService.updateMyProfile(request));
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ApiResponse<PaginationResponse<OrderSummaryResponse>> getMyOrderHistory(
            @Valid @ModelAttribute CustomerOrderHistoryQuery query) {
        PaginationResponse<OrderSummaryResponse> response = orderService.getMyOrderHistory(query);
        String message = response.getItems().isEmpty()
                ? "No order history available"
                : "Order history fetched successfully";
        return ApiResponse.success(message, response);
    }
}
