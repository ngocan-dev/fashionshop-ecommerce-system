package com.example.fashionshop.common.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.lang.Nullable;

public final class SecurityUtil {

    private SecurityUtil() {
    }

    public static @Nullable String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }
        return authentication.getName();
    }
}
