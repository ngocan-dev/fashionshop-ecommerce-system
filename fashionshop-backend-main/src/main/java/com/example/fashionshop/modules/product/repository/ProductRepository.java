package com.example.fashionshop.modules.product.repository;

import com.example.fashionshop.modules.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Page<Product> findByIsActiveTrue(Pageable pageable);

    Page<Product> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);

    Page<Product> findByIsActiveTrueAndNameContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    @Query("""
            SELECT p
            FROM Product p
            JOIN p.category c
            WHERE p.isActive = true
              AND (
                LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR (p.description IS NOT NULL AND LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
              )
            ORDER BY (
                CASE WHEN LOWER(p.name) = LOWER(:keyword) THEN 100 ELSE 0 END +
                CASE WHEN LOWER(p.name) LIKE LOWER(CONCAT(:keyword, '%')) THEN 60 ELSE 0 END +
                CASE WHEN LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 40 ELSE 0 END +
                CASE WHEN LOWER(c.name) = LOWER(:keyword) THEN 35 ELSE 0 END +
                CASE WHEN LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 25 ELSE 0 END +
                CASE WHEN p.description IS NOT NULL AND LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 15 ELSE 0 END
            ) DESC,
            p.updatedAt DESC,
            p.createdAt DESC
            """)
    Page<Product> searchActiveProductsByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.isFeatured = true AND p.isActive = true ORDER BY p.createdAt DESC")
    List<Product> findTop8FeaturedActiveWithCategory(Pageable pageable);


    Optional<Product> findByIdAndIsActiveTrue(Integer id);
}
