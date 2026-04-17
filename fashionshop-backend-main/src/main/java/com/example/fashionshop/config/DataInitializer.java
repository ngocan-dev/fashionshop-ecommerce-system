package com.example.fashionshop.config;

import com.example.fashionshop.modules.product.entity.Product;
import com.example.fashionshop.modules.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Ensures seed data is usable after a fresh database import.
 * If every product has stock_quantity = 0 the app bootstraps sensible defaults
 * so Add-to-Cart works without requiring a manual SQL update.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer {

    private static final int DEFAULT_STOCK = 50;

    private final ProductRepository productRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void ensureProductStock() {
        List<Product> zeroStock = productRepository.findAll().stream()
                .filter(p -> Boolean.TRUE.equals(p.getIsActive())
                        && (p.getStockQuantity() == null || p.getStockQuantity() == 0))
                .toList();

        if (!zeroStock.isEmpty()) {
            zeroStock.forEach(p -> p.setStockQuantity(DEFAULT_STOCK));
            productRepository.saveAll(zeroStock);
            log.info("DataInitializer: set stock_quantity={} for {} product(s) that had 0 stock.",
                    DEFAULT_STOCK, zeroStock.size());
        }
    }
}
