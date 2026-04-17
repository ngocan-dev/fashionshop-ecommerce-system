package com.example.fashionshop.common.exception;

public class ProductDeletionException extends RuntimeException {
    public ProductDeletionException() {
        super("Product deletion failed");
    }
}
