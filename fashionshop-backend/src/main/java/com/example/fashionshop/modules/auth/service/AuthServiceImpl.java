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
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        String fullName = resolveFullName(request);
        User user = User.builder()
                .fullName(fullName)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .isActive(true)
                .build();

        try {
            User savedUser = userRepository.save(user);
            UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());

            return AuthResponse.builder()
                    .token(jwtService.generateToken(userDetails))
                    .userId(savedUser.getId())
                    .fullName(savedUser.getFullName())
                    .email(savedUser.getEmail())
                    .role(savedUser.getRole())
                    .build();
        } catch (Exception exception) {
            throw new AccountCreationException("Account creation failed");
        }
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new BadRequestException("Invalid email or password"));

            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            return AuthResponse.builder()
                    .token(jwtService.generateToken(userDetails))
                    .userId(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build();
        } catch (AuthenticationException ex) {
            throw new UnauthorizedException("Invalid email or password");
        } catch (Exception ex) {
            throw new AuthenticationSystemException("Login failed, please try again later");
        }
    }

    @Override
    public void logout(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        String token = authHeader.substring(7);
        if (token.isBlank() || tokenBlacklistService.isBlacklisted(token)) {
            return;
        }

        try {
            tokenBlacklistService.blacklistToken(token, jwtService.extractExpiration(token));
        } catch (Exception ex) {
            // Keep logout idempotent for JWT-based auth.
        }
    }

    private String resolveFullName(RegisterRequest request) {
        if (StringUtils.hasText(request.getFullName())) {
            return request.getFullName().trim();
        }
        String email = request.getEmail();
        int delimiterIndex = email.indexOf('@');
        if (delimiterIndex > 0) {
            return email.substring(0, delimiterIndex);
        }
        return email;
    }
}
