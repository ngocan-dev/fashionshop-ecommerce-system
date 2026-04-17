package com.example.fashionshop.modules.wishlist.controller;

import com.example.fashionshop.common.exception.GlobalExceptionHandler;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.common.exception.WishlistUpdateException;
import com.example.fashionshop.modules.wishlist.dto.AddWishlistItemResponse;
import com.example.fashionshop.modules.wishlist.dto.WishlistItemResponse;
import com.example.fashionshop.modules.wishlist.service.WishlistService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(WishlistController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({GlobalExceptionHandler.class, com.example.fashionshop.config.TestSecurityConfig.class})
class WishlistControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WishlistService wishlistService;

    @Test
    void addToWishlist_shouldReturnSuccessWhenProductIsAdded() throws Exception {
        AddWishlistItemResponse response = AddWishlistItemResponse.builder()
                .alreadyInWishlist(false)
                .wishlistCount(3)
                .item(WishlistItemResponse.builder()
                        .wishlistId(10)
                        .productId(101)
                        .productName("Classic Blazer")
                        .price(new BigDecimal("120.00"))
                        .imageUrl("https://cdn.example.com/product-101.jpg")
                        .createdAt(LocalDateTime.now())
                        .build())
                .build();

        when(wishlistService.addToWishlist(any())).thenReturn(response);

        mockMvc.perform(post("/api/wishlist/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"productId\": 101
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Added to wishlist successfully"))
                .andExpect(jsonPath("$.data.alreadyInWishlist").value(false))
                .andExpect(jsonPath("$.data.wishlistCount").value(3))
                .andExpect(jsonPath("$.data.item.productId").value(101));
    }

    @Test
    void addToWishlist_shouldReturnDuplicateMessageWhenProductAlreadyExists() throws Exception {
        AddWishlistItemResponse response = AddWishlistItemResponse.builder()
                .alreadyInWishlist(true)
                .wishlistCount(3)
                .item(WishlistItemResponse.builder().wishlistId(10).productId(101).build())
                .build();

        when(wishlistService.addToWishlist(any())).thenReturn(response);

        mockMvc.perform(post("/api/wishlist/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"productId\": 101
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Product already in wishlist"))
                .andExpect(jsonPath("$.data.alreadyInWishlist").value(true));
    }

    @Test
    void addToWishlist_shouldReturnNotFoundWhenProductDoesNotExist() throws Exception {
        when(wishlistService.addToWishlist(any())).thenThrow(new ResourceNotFoundException("Product not found"));

        mockMvc.perform(post("/api/wishlist/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"productId\": 9999
                                }
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Product not found"));
    }

    @Test
    void addToWishlist_shouldReturnUnableToAddWhenDatabaseUpdateFails() throws Exception {
        when(wishlistService.addToWishlist(any()))
                .thenThrow(new WishlistUpdateException("Unable to add product to wishlist", new RuntimeException()));

        mockMvc.perform(post("/api/wishlist/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"productId\": 101
                                }
                                """))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Unable to add product to wishlist"));
    }
}
