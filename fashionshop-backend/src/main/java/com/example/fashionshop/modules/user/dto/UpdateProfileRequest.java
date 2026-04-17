package com.example.fashionshop.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must be at most 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    @Size(max = 100, message = "Email must be at most 100 characters")
    private String email;

    @Pattern(
            regexp = "^$|^\\+?[0-9()\\-\\s]{7,20}$",
            message = "Phone number format is invalid"
    )
    private String phoneNumber;

    @Size(max = 255, message = "Address must be at most 255 characters")
    private String address;

    @Pattern(
            regexp = "^$|^(https?://).+",
            message = "Avatar must be a valid http/https URL"
    )
    @Size(max = 512, message = "Avatar URL must be at most 512 characters")
    private String avatarUrl;

    @Size(max = 500, message = "Bio must be at most 500 characters")
    private String bio;
}
