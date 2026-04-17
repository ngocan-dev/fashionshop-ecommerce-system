package com.example.fashionshop.modules.order.pricing;

import java.math.BigDecimal;

/**
 * Decorator Pattern — Abstract Decorator.
 * Holds a reference to the wrapped {@link PriceCalculator} and forwards calls through it.
 */
public abstract class PriceCalculatorDecorator implements PriceCalculator {

    protected final PriceCalculator delegate;

    protected PriceCalculatorDecorator(PriceCalculator delegate) {
        this.delegate = delegate;
    }

    @Override
    public BigDecimal calculate(BigDecimal subtotal) {
        return delegate.calculate(subtotal);
    }
}
