package com.example.fashionshop.security.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final BlacklistedTokenRepository blacklistedTokenRepository;

    @Transactional
    public void blacklistToken(String token, Date expiry) {
        if (token == null || token.isBlank() || expiry == null) {
            return;
        }
        blacklistedTokenRepository.deleteExpiredTokens(new Date());
        if (!blacklistedTokenRepository.existsByToken(token)) {
            blacklistedTokenRepository.save(
                    BlacklistedToken.builder().token(token).expiryAt(expiry).build()
            );
        }
    }

    @Transactional(readOnly = true)
    public boolean isBlacklisted(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        return blacklistedTokenRepository.findByToken(token)
                .map(bt -> bt.getExpiryAt().after(new Date()))
                .orElse(false);
    }
}
