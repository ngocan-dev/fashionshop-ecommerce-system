package com.example.fashionshop.common.exception;

public class ProductUpdateException extends RuntimeException {
    public ProductUpdateException() {
        super("Product update failed");
    }
}
