package com.example.fashionshop.modules.auth.service;

import com.example.fashionshop.common.enums.Role;
import com.example.fashionshop.common.exception.AccountCreationException;
import com.example.fashionshop.common.exception.AuthenticationSystemException;
import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.UnauthorizedException;
import com.example.fashionshop.modules.auth.dto.AuthResponse;
import com.example.fashionshop.modules.auth.dto.LoginRequest;
import com.example.fashionshop.modules.auth.dto.RegisterRequest;
import com.example.fashionshop.modules.user.entity.User;
import com.example.fashionshop.modules.user.repository.UserRepository;
import com.example.fashionshop.security.jwt.JwtService;
import com.example.fashionshop.security.jwt.TokenBlacklistService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private JwtService jwtService;

    @Mock
    private TokenBlacklistService tokenBlacklistService;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void registerShouldDefaultFullNameFromEmailWhenFullNameMissing() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new.customer@example.com");
        request.setPassword("password123");
        request.setVerifiedPassword("password123");

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(99);
            return savedUser;
        });
        when(userDetailsService.loadUserByUsername(request.getEmail())).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertEquals("new.customer", response.getFullName());
        assertEquals("jwt-token", response.getToken());
        assertEquals(Role.CUSTOMER, response.getRole());
    }

    @Test
    void registerShouldThrowAccountCreationExceptionWhenSaveFails() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Jane");
        request.setEmail("jane@example.com");
        request.setPassword("password123");
        request.setVerifiedPassword("password123");

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenThrow(new RuntimeException("DB error"));

        assertThrows(AccountCreationException.class, () -> authService.register(request));
    }

    @Test
    void loginShouldReturnAuthResponseWhenCredentialsAreValid() {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("password123");

        User user = User.builder()
                .id(1)
                .fullName("Test User")
                .email("user@test.com")
                .role(Role.CUSTOMER)
                .build();

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(userDetailsService.loadUserByUsername("user@test.com")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertEquals("jwt-token", response.getToken());
        assertEquals(1, response.getUserId());
        assertEquals("Test User", response.getFullName());
        assertEquals("user@test.com", response.getEmail());
        assertEquals(Role.CUSTOMER, response.getRole());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void loginShouldThrowUnauthorizedWhenCredentialsAreInvalid() {
        LoginRequest request = new LoginRequest();
        request.setEmail("wrong@test.com");
        request.setPassword("wrong-password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () -> authService.login(request));

        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    void loginShouldThrowAuthenticationSystemExceptionWhenUnexpectedErrorOccurs() {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Database unavailable"));

        AuthenticationSystemException exception = assertThrows(AuthenticationSystemException.class,
                () -> authService.login(request));

        assertEquals("Login failed, please try again later", exception.getMessage());
    }

    @Test
    void logoutShouldDoNothingWhenAuthorizationHeaderMissing() {
        assertDoesNotThrow(() -> authService.logout(null));
        verify(tokenBlacklistService, never()).blacklistToken(any(), any());
    }

    @Test
    void logoutShouldBlacklistTokenWhenBearerTokenIsValid() {
        String token = "jwt-token";
        String authHeader = "Bearer " + token;

        when(tokenBlacklistService.isBlacklisted(token)).thenReturn(false);
        when(jwtService.extractExpiration(token)).thenReturn(new java.util.Date(System.currentTimeMillis() + 60_000));

        assertDoesNotThrow(() -> authService.logout(authHeader));

        verify(tokenBlacklistService).blacklistToken(eq(token), any());
    }

    @Test
    void logoutShouldIgnoreInvalidBearerToken() {
        String token = "invalid-token";
        String authHeader = "Bearer " + token;

        when(tokenBlacklistService.isBlacklisted(token)).thenReturn(false);
        when(jwtService.extractExpiration(token)).thenThrow(new RuntimeException("invalid token"));

        assertDoesNotThrow(() -> authService.logout(authHeader));
        verify(tokenBlacklistService, never()).blacklistToken(any(), any());
    }
}
