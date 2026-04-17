package com.example.fashionshop.modules.user.service;

import com.example.fashionshop.common.enums.Role;
import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.modules.user.dto.CreateStaffRequest;
import com.example.fashionshop.modules.user.dto.UpdateProfileRequest;
import com.example.fashionshop.modules.user.dto.UserResponse;
import com.example.fashionshop.modules.user.entity.User;
import com.example.fashionshop.modules.user.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @AfterEach
    void cleanUpSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createStaffShouldPersistAssignedRole() {
        SecurityContextHolder.getContext()
                .setAuthentication(new UsernamePasswordAuthenticationToken("admin@shop.com", "password"));

        User admin = User.builder().id(1).email("admin@shop.com").role(Role.ADMIN).isActive(true).build();
        CreateStaffRequest request = new CreateStaffRequest();
        request.setFullName("Staff One");
        request.setEmail("staff1@shop.com");
        request.setPassword("secret123");
        request.setConfirmPassword("secret123");
        request.setRole(Role.STAFF);

        when(userRepository.existsByEmail("staff1@shop.com")).thenReturn(false);
        when(userRepository.findByEmail("admin@shop.com")).thenReturn(Optional.of(admin));
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-secret");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(20);
            return user;
        });

        UserResponse response = userService.createStaff(request);

        assertEquals(Role.STAFF, response.getRole());
        assertEquals("staff1@shop.com", response.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createStaffShouldRejectCustomerRole() {
        CreateStaffRequest request = new CreateStaffRequest();
        request.setFullName("Customer Role");
        request.setEmail("customer-role@shop.com");
        request.setPassword("secret123");
        request.setConfirmPassword("secret123");
        request.setRole(Role.CUSTOMER);

        when(userRepository.existsByEmail("customer-role@shop.com")).thenReturn(false);

        assertThrows(BadRequestException.class, () -> userService.createStaff(request));
    }

    @Test
    void updateMyProfileShouldSaveAllowedFields() {
        SecurityContextHolder.getContext()
                .setAuthentication(new UsernamePasswordAuthenticationToken("customer@shop.com", "password"));

        User customer = User.builder()
                .id(7)
                .email("customer@shop.com")
                .fullName("Old Name")
                .role(Role.CUSTOMER)
                .isActive(true)
                .build();

        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFullName("  Jane Doe  ");
        request.setEmail("  jane@shop.com ");
        request.setPhoneNumber("  +1 202-555-1234 ");
        request.setAddress(" 123 Main St ");
        request.setAvatarUrl("https://cdn.shop.com/avatar/jane.png");
        request.setBio("  Hello there ");

        when(userRepository.findByEmail("customer@shop.com")).thenReturn(Optional.of(customer));
        when(userRepository.existsByEmailAndIdNot("jane@shop.com", 7)).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.updateMyProfile(request);

        assertEquals("Jane Doe", response.getFullName());
        assertEquals("jane@shop.com", response.getEmail());
        assertEquals("+1 202-555-1234", response.getPhoneNumber());
        assertEquals("123 Main St", response.getAddress());
        assertEquals("https://cdn.shop.com/avatar/jane.png", response.getAvatarUrl());
        assertEquals("Hello there", response.getBio());
    }

    @Test
    void updateMyProfileShouldRejectDuplicateEmail() {
        SecurityContextHolder.getContext()
                .setAuthentication(new UsernamePasswordAuthenticationToken("customer@shop.com", "password"));

        User customer = User.builder()
                .id(7)
                .email("customer@shop.com")
                .fullName("Old Name")
                .role(Role.CUSTOMER)
                .isActive(true)
                .build();

        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFullName("Jane Doe");
        request.setEmail("exists@shop.com");

        when(userRepository.findByEmail("customer@shop.com")).thenReturn(Optional.of(customer));
        when(userRepository.existsByEmailAndIdNot("exists@shop.com", 7)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> userService.updateMyProfile(request));
    }

    @Test
    void updateMyProfileShouldSetOptionalBlankFieldsToNull() {
        SecurityContextHolder.getContext()
                .setAuthentication(new UsernamePasswordAuthenticationToken("customer@shop.com", "password"));

        User customer = User.builder()
                .id(7)
                .email("customer@shop.com")
                .fullName("Old Name")
                .role(Role.CUSTOMER)
                .isActive(true)
                .build();

        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFullName("Jane Doe");
        request.setEmail("jane@shop.com");
        request.setPhoneNumber("   ");
        request.setAddress("");
        request.setBio(" ");

        when(userRepository.findByEmail("customer@shop.com")).thenReturn(Optional.of(customer));
        when(userRepository.existsByEmailAndIdNot("jane@shop.com", 7)).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.updateMyProfile(request);
        assertNull(response.getPhoneNumber());
        assertNull(response.getAddress());
        assertNull(response.getBio());
    }
}
