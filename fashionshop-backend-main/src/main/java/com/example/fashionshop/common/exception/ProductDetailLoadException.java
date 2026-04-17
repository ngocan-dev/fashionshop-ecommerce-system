package com.example.fashionshop.common.exception;

public class ProductDetailLoadException extends RuntimeException {
    public ProductDetailLoadException() {
        super("Unable to load product details");
    }
}
