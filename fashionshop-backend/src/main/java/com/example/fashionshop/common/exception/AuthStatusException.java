package com.example.fashionshop.common.exception;

public class AuthStatusException extends UnauthorizedException {

    private final String code;

    public AuthStatusException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
