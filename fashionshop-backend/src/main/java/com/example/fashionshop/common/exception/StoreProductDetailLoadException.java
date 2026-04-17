package com.example.fashionshop.common.exception;

public class StoreProductDetailLoadException extends RuntimeException {
    public StoreProductDetailLoadException() {
        super("Unable to load product details. Please try again");
    }
}
