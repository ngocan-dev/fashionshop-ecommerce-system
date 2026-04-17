package com.example.fashionshop.modules.order.pricing;

import java.math.BigDecimal;

/**
 * Decorator Pattern — adds a fixed shipping fee on top of the delegated result.
 */
public class ShippingFeeDecorator extends PriceCalculatorDecorator {

    private final BigDecimal shippingFee;

    public ShippingFeeDecorator(PriceCalculator delegate, BigDecimal shippingFee) {
        super(delegate);
        this.shippingFee = shippingFee == null ? BigDecimal.ZERO : shippingFee;
    }

    @Override
    public BigDecimal calculate(BigDecimal subtotal) {
        return super.calculate(subtotal).add(shippingFee);
    }
}
