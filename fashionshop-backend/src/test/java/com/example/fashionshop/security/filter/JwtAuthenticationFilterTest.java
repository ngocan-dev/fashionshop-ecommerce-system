package com.example.fashionshop.security.filter;

import com.example.fashionshop.security.jwt.JwtService;
import com.example.fashionshop.security.jwt.TokenBlacklistService;
import com.example.fashionshop.security.service.CustomUserDetailsService;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService customUserDetailsService;

    @Mock
    private TokenBlacklistService tokenBlacklistService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @BeforeEach
    void setUp() {
        jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtService, customUserDetailsService, tokenBlacklistService);
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldContinueChainWhenTokenIsMalformed() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer malformed-token");
        when(tokenBlacklistService.isBlacklisted("malformed-token")).thenReturn(false);
        when(jwtService.extractUsername("malformed-token")).thenThrow(new MalformedJwtException("Malformed"));

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(customUserDetailsService, never()).loadUserByUsername("malformed-token");
        verify(filterChain).doFilter(request, response);
    }
}
