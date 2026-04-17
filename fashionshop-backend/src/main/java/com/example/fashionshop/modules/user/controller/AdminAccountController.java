package com.example.fashionshop.modules.user.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.modules.user.dto.DeleteAccountRequest;
import com.example.fashionshop.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
public class AdminAccountController {

    private final UserService userService;

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAccountById(@PathVariable Long id,
                                               @RequestBody(required = false) DeleteAccountRequest request) {
        Boolean confirm = request != null ? request.getConfirm() : Boolean.FALSE;
        userService.deleteAccountById(id, confirm);
        return ApiResponse.success("Account deleted successfully", null);
    }

    @DeleteMapping("/by-email")
    public ApiResponse<Void> deleteAccountByEmail(@RequestParam String email,
                                                  @RequestBody(required = false) DeleteAccountRequest request) {
        Boolean confirm = request != null ? request.getConfirm() : Boolean.FALSE;
        userService.deleteAccountByEmail(email, confirm);
        return ApiResponse.success("Account deleted successfully", null);
    }
}
