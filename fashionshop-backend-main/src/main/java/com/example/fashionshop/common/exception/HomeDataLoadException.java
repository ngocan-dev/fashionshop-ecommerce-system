package com.example.fashionshop.common.exception;

public class HomeDataLoadException extends RuntimeException {
    public HomeDataLoadException() {
        super("Unable to load homepage");
    }
}