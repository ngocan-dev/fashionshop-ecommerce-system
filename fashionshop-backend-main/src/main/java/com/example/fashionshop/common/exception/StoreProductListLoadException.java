package com.example.fashionshop.common.exception;

public class StoreProductListLoadException extends RuntimeException {
    public StoreProductListLoadException() {
        super("Unable to load products");
    }
}
