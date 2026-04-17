package com.example.fashionshop.modules.auth.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RegisterRequestValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void shouldFailWhenVerifiedPasswordDoesNotMatch() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Alice");
        request.setEmail("alice@example.com");
        request.setPassword("password123");
        request.setVerifiedPassword("differentPassword123");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertTrue(violations.stream().anyMatch(v -> "Password and verified password do not match".equals(v.getMessage())));
    }

    @Test
    void shouldFailWhenVerifiedPasswordIsMissing() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Alice");
        request.setEmail("alice@example.com");
        request.setPassword("password123");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertTrue(violations.stream().anyMatch(v -> "Verified password is required".equals(v.getMessage())));
        assertFalse(violations.isEmpty());
    }
}
