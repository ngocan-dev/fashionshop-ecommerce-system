package com.example.fashionshop.common.exception;

public class SearchResultLoadException extends RuntimeException {
    public SearchResultLoadException() {
        super("Unable to load search results");
    }
}
