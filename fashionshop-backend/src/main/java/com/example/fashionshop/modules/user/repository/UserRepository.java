package com.example.fashionshop.modules.user.repository;

import com.example.fashionshop.common.enums.Role;
import com.example.fashionshop.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Integer id);

    List<User> findByRole(Role role);

    List<User> findByRoleOrderByIdDesc(Role role);

    long countByRole(Role role);

    long countByIsActive(Boolean isActive);

    List<User> findTop5ByOrderByCreatedAtDesc();

    List<User> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime from, LocalDateTime to);
}
