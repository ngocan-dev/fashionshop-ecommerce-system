package com.example.fashionshop.modules.order.pricing;

import java.math.BigDecimal;

/**
 * Decorator Pattern — Concrete Component.
 * Returns the raw subtotal unchanged; decorators layer adjustments on top.
 */
public class BasePriceCalculator implements PriceCalculator {

    @Override
    public BigDecimal calculate(BigDecimal subtotal) {
        return subtotal == null ? BigDecimal.ZERO : subtotal;
    }
}
