package com.example.fashionshop.modules.order.pricing;

import java.math.BigDecimal;

/**
 * Decorator Pattern — subtracts a flat discount from the delegated result.
 */
public class DiscountDecorator extends PriceCalculatorDecorator {

    private final BigDecimal discount;

    public DiscountDecorator(PriceCalculator delegate, BigDecimal discount) {
        super(delegate);
        this.discount = discount == null ? BigDecimal.ZERO : discount;
    }

    @Override
    public BigDecimal calculate(BigDecimal subtotal) {
        return super.calculate(subtotal).subtract(discount);
    }
}
