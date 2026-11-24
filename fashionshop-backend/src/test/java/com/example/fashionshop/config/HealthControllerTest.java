package com.example.fashionshop.config;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.jdbc.core.JdbcTemplate;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HealthControllerTest {
    @Test void databaseFailureReturns503WithoutInternalDetails() {
        JdbcTemplate jdbc = mock(JdbcTemplate.class);
        when(jdbc.queryForObject("SELECT 1", Integer.class))
                .thenThrow(new DataAccessResourceFailureException("private database details"));
        var response = new HealthController(jdbc).health();
        assertEquals(503, response.getStatusCode().value());
        assertEquals(java.util.Map.of("status", "DOWN"), response.getBody());
    }
}
