package com.example.fashionshop.modules.user.service;

import com.example.fashionshop.modules.user.dto.CreateStaffRequest;
import com.example.fashionshop.modules.user.dto.CustomerAccountResponse;
import com.example.fashionshop.modules.user.dto.CustomerProfileResponse;
import com.example.fashionshop.modules.user.dto.StaffAccountResponse;
import com.example.fashionshop.modules.user.dto.UpdateProfileRequest;
import com.example.fashionshop.modules.user.dto.UpdateStaffRequest;
import com.example.fashionshop.modules.user.dto.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse getMyProfile();

    UserResponse updateMyProfile(UpdateProfileRequest request);

    CustomerProfileResponse getCurrentCustomerProfile();

    UserResponse createStaff(CreateStaffRequest request);

    List<UserResponse> getStaffAccounts();

    List<StaffAccountResponse> getAllStaffAccounts();

    List<UserResponse> getCustomerAccounts();

    List<CustomerAccountResponse> getAllCustomerAccounts();

    void deactivateUser(Integer userId);

    UserResponse updateStaff(Integer userId, UpdateStaffRequest request);

    void activateUser(Integer userId);

    void deleteAccountById(Long id, Boolean confirm);

    void deleteAccountByEmail(String email, Boolean confirm);
}
