package com.example.fashionshop.common.exception;

public class CartLoadException extends RuntimeException {
    public CartLoadException() {
        super("Unable to load cart items");
    }

    public CartLoadException(String message, Throwable cause) {
        super(message, cause);
    }
}
