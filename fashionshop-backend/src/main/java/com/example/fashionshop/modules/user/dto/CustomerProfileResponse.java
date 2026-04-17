package com.example.fashionshop.modules.user.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class CustomerProfileResponse {
    private PersonalInfo personalInfo;
    private AccountInfo accountInfo;
    private AddressInfo addressInfo;
    private ProfileExtras extras;

    @Data
    @Builder
    public static class PersonalInfo {
        private String fullName;
        private String email;
        private String phoneNumber;
        private LocalDate dateOfBirth;
        private String gender;
    }

    @Data
    @Builder
    public static class AccountInfo {
        private Integer accountId;
        private String accountRole;
        private LocalDateTime registrationDate;
        private String accountStatus;
    }

    @Data
    @Builder
    public static class AddressInfo {
        private String defaultShippingAddress;
        private String billingAddress;
        private String city;
        private String districtOrState;
        private String postalCode;
        private String country;
    }

    @Data
    @Builder
    public static class ProfileExtras {
        private String avatarUrl;
        private String linkedLoginProvider;
        private Boolean newsletterSubscribed;
        private RecentActivitySummary recentActivity;
    }

    @Data
    @Builder
    public static class RecentActivitySummary {
        private Integer totalOrders;
        private LocalDateTime lastOrderDate;
        private String lastOrderStatus;
    }
}
