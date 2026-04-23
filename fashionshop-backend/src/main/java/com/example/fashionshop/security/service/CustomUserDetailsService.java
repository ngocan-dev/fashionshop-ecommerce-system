package com.example.fashionshop.security.service;

import com.example.fashionshop.common.enums.AccountStatus;
import com.example.fashionshop.modules.user.entity.User;
import com.example.fashionshop.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public @NonNull UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> {
                System.out.println("[WARN] User not found with email: " + username);
                return new UsernameNotFoundException("User not found with email: " + username);
            });
        AccountStatus accountStatus = user.getAccountStatus() == null
                ? (Boolean.TRUE.equals(user.getIsActive()) ? AccountStatus.ACTIVE : AccountStatus.LOCKED)
                : user.getAccountStatus();
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            accountStatus != AccountStatus.DELETED,
            true,
            true,
            accountStatus != AccountStatus.LOCKED,
            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
