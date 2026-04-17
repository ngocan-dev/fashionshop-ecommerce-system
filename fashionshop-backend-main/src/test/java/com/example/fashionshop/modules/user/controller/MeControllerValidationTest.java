package com.example.fashionshop.modules.user.controller;

import com.example.fashionshop.common.exception.GlobalExceptionHandler;
import com.example.fashionshop.common.exception.OrderListLoadException;
import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.modules.order.dto.OrderSummaryResponse;
import com.example.fashionshop.modules.order.service.OrderService;
import com.example.fashionshop.modules.user.service.UserService;
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
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MeController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({GlobalExceptionHandler.class, com.example.fashionshop.config.TestSecurityConfig.class})
class MeControllerValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private OrderService orderService;

    @Test
    void updateMyProfileShouldReturnValidationMessageForInvalidEmail() throws Exception {
        mockMvc.perform(put("/api/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Jane Doe",
                                  "email": "invalid-email"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Validation failed")));
    }

    @Test
    void getMyOrderHistoryShouldReturnOrdersForCustomer() throws Exception {
        PaginationResponse<OrderSummaryResponse> response = PaginationResponse.<OrderSummaryResponse>builder()
                .items(List.of(OrderSummaryResponse.builder()
                        .orderId(1001)
                        .orderCode("INV-AB12CD34")
                        .orderDate(LocalDateTime.of(2026, 3, 20, 10, 30))
                        .totalAmount(new BigDecimal("320.00"))
                        .paymentStatus("PAID")
                        .paymentMethod("COD")
                        .shippingStatus("DELIVERED")
                        .detailPath("/account/orders/1001")
                        .itemCount(2)
                        .build()))
                .page(0)
                .size(10)
                .totalItems(1)
                .totalPages(1)
                .build();

        when(orderService.getMyOrderHistory(any())).thenReturn(response);

        mockMvc.perform(get("/api/me/orders").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Order history fetched successfully"))
                .andExpect(jsonPath("$.data.items[0].orderId").value(1001))
                .andExpect(jsonPath("$.data.items[0].totalAmount").value(320.00))
                .andExpect(jsonPath("$.data.items[0].detailPath").value("/account/orders/1001"));
    }

    @Test
    void getMyOrderHistoryShouldReturnEmptyMessageWhenNoOrdersFound() throws Exception {
        PaginationResponse<OrderSummaryResponse> response = PaginationResponse.<OrderSummaryResponse>builder()
                .items(List.of())
                .page(0)
                .size(10)
                .totalItems(0)
                .totalPages(0)
                .build();

        when(orderService.getMyOrderHistory(any())).thenReturn(response);

        mockMvc.perform(get("/api/me/orders").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("No order history available"))
                .andExpect(jsonPath("$.data.items").isEmpty());
    }

    @Test
    void getMyOrderHistoryShouldReturnFailureWhenServiceFails() throws Exception {
        when(orderService.getMyOrderHistory(any())).thenThrow(new OrderListLoadException("Unable to load order history"));

        mockMvc.perform(get("/api/me/orders").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Unable to load order history"));
    }
}
