package com.example.fashionshop.common.exception;

public class InvoiceDetailLoadException extends RuntimeException {
    public InvoiceDetailLoadException(String message) {
        super(message);
    }

    public InvoiceDetailLoadException(Throwable cause) {
        super("Unable to load invoice details", cause);
    }
}
