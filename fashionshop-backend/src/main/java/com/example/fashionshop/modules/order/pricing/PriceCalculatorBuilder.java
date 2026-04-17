package com.example.fashionshop.modules.order.pricing;

import java.math.BigDecimal;

/**
 * Fluent builder that composes a {@link PriceCalculator} decorator chain.
 *
 * <pre>{@code
 * PriceCalculator calculator = PriceCalculatorBuilder.base()
 *         .withShipping(shippingFee)
 *         .withDiscount(discountAmount)
 *         .build();
 * BigDecimal total = calculator.calculate(subtotal);
 * }</pre>
 */
public final class PriceCalculatorBuilder {

    private PriceCalculator calculator;

    private PriceCalculatorBuilder() {
        this.calculator = new BasePriceCalculator();
    }

    public static PriceCalculatorBuilder base() {
        return new PriceCalculatorBuilder();
    }

    public PriceCalculatorBuilder withShipping(BigDecimal fee) {
        this.calculator = new ShippingFeeDecorator(this.calculator, fee);
        return this;
    }

    public PriceCalculatorBuilder withDiscount(BigDecimal discount) {
        this.calculator = new DiscountDecorator(this.calculator, discount);
        return this;
    }

    public PriceCalculator build() {
        return calculator;
    }
}
