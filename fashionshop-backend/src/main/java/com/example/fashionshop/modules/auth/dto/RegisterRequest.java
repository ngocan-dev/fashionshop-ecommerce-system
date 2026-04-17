package com.example.fashionshop.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Verified password is required")
    private String verifiedPassword;

    @AssertTrue(message = "Password and verified password do not match")
    public boolean isPasswordMatched() {
        if (password == null || verifiedPassword == null) {
            return true;
        }
        return password.equals(verifiedPassword);
    }
}
