package com.example.fashionshop.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.web.servlet.MockMvc;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "app.cors.allowed-origins=https://shop.example.com")
@AutoConfigureMockMvc
class DeploymentConfigurationTest {
    @Autowired MockMvc mvc;
    @Autowired ApplicationContext context;

    @Test void healthIsPublicAndDatabaseIsReady() throws Exception {
        mvc.perform(get("/api/health"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("UP"));
    }

    @Test void permitsConfiguredOrigin() throws Exception {
        mvc.perform(options("/api/products")
                .header("Origin", "https://shop.example.com")
                .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://shop.example.com"));
    }

    @Test void rejectsOtherOrigins() throws Exception {
        mvc.perform(options("/api/products")
                .header("Origin", "https://untrusted.example.com")
                .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }

    @Test void doesNotInitializeStockByDefault() {
        assertTrue(context.getBeansOfType(DataInitializer.class).isEmpty());
    }
}
