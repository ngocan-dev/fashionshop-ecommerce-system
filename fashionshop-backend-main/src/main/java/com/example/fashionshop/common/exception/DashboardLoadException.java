package com.example.fashionshop.common.exception;

public class DashboardLoadException extends RuntimeException {
    public DashboardLoadException() {
        super("Unable to load dashboard");
    }
}
