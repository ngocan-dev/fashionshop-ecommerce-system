package com.example.fashionshop;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

/**
 * Intentionally failing test used to demonstrate that the CI release gate
 * blocks a broken candidate from reaching main. Do not merge.
 */
class CiGateDemoTest {

    @Test
    void intentionallyFailsToDemonstrateReleaseGate() {
        assertEquals(1, 2, "Intentional failure: CI gate demonstration (do not merge)");
    }
}
