package com.example.fashionshop.common.exception;

public class ProductListLoadException extends RuntimeException {
    public ProductListLoadException() {
        super("Unable to load product list");
    }
}
