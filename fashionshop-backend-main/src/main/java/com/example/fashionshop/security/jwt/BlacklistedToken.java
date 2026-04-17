package com.example.fashionshop.security.jwt;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "blacklisted_tokens", indexes = {
        @Index(name = "idx_blacklisted_token", columnList = "token", unique = true),
        @Index(name = "idx_blacklisted_expiry", columnList = "expiry_at")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlacklistedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 512)
    private String token;

    @Column(name = "expiry_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiryAt;
}
