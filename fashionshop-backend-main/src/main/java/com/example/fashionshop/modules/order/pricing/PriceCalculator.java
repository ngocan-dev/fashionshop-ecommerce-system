package com.example.fashionshop.modules.order.pricing;

import java.math.BigDecimal;

/**
 * Decorator Pattern — Component interface for price calculation.
 * Concrete decorators wrap this interface to layer shipping fees and discounts
 * over the base subtotal without touching the caller.
 */
public interface PriceCalculator {
    BigDecimal calculate(BigDecimal subtotal);
}
