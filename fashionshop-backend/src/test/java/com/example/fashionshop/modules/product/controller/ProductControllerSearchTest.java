package com.example.fashionshop.modules.product.controller;

import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.GlobalExceptionHandler;
import com.example.fashionshop.common.exception.SearchResultLoadException;
import com.example.fashionshop.modules.product.dto.ProductSearchResponse;
import com.example.fashionshop.modules.product.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({GlobalExceptionHandler.class, com.example.fashionshop.config.TestSecurityConfig.class})
class ProductControllerSearchTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    void search_shouldReturnTopResultsWhenKeywordMatches() throws Exception {
        ProductSearchResponse result = ProductSearchResponse.builder()
                .id(10)
                .slug("product-10")
                .name("Classic Blazer")
                .categoryName("Blazers")
                .price(new BigDecimal("199.99"))
                .thumbnailImageUrl("https://cdn.example.com/products/10.jpg")
                .descriptionSnippet("Classic fit")
                .inStock(true)
                .stockStatus("IN_STOCK")
                .productDetailUrl("/products/10")
                .build();

        when(productService.searchProducts("blazer")).thenReturn(List.of(result));

        mockMvc.perform(get("/api/products/search")
                        .param("keyword", "blazer")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Search results fetched successfully"))
                .andExpect(jsonPath("$.data[0].id").value(10))
                .andExpect(jsonPath("$.data[0].categoryName").value("Blazers"));
    }

    @Test
    void search_shouldReturnNoResultsFoundWhenKeywordHasNoMatch() throws Exception {
        when(productService.searchProducts("unknown")).thenReturn(List.of());

        mockMvc.perform(get("/api/products/search")
                        .param("keyword", "unknown")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("No results found"))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void search_shouldReturnBadRequestWhenKeywordIsInvalid() throws Exception {
        when(productService.searchProducts("   ")).thenThrow(new BadRequestException("Please enter a keyword"));

        mockMvc.perform(get("/api/products/search")
                        .param("keyword", "   ")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Please enter a keyword"));
    }

    @Test
    void search_shouldReturnInternalServerErrorWhenSearchFails() throws Exception {
        when(productService.searchProducts("dress")).thenThrow(new SearchResultLoadException());

        mockMvc.perform(get("/api/products/search")
                        .param("keyword", "dress")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Unable to load search results"));
    }
}
