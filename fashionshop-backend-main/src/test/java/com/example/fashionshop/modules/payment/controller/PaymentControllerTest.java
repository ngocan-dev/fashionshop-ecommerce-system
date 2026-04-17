package com.example.fashionshop.modules.payment.controller;

import com.example.fashionshop.common.enums.CustomerPaymentState;
import com.example.fashionshop.common.enums.OrderStatus;
import com.example.fashionshop.common.enums.PaymentMethod;
import com.example.fashionshop.common.enums.PaymentStatus;
import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.ForbiddenException;
import com.example.fashionshop.common.exception.GlobalExceptionHandler;
import com.example.fashionshop.common.exception.PaymentGatewayException;
import com.example.fashionshop.common.exception.PaymentStatusLoadException;
import com.example.fashionshop.modules.payment.dto.CustomerPaymentStatusResponse;
import com.example.fashionshop.modules.payment.dto.PaymentRequest;
import com.example.fashionshop.modules.payment.dto.PaymentResponse;
import com.example.fashionshop.modules.payment.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PaymentController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({GlobalExceptionHandler.class, com.example.fashionshop.config.TestSecurityConfig.class})
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    // ================= PROCESS PAYMENT =================
    @Test
    void processPayment_shouldReturnSuccessWhenGatewayChargeIsSuccessful() throws Exception {
        PaymentRequest request = new PaymentRequest();
        request.setPaymentMethod(PaymentMethod.BANKING);
        request.setCardHolderName("Jane Customer");
        request.setCardNumber("4111111111111111");
        request.setExpiryMonth("12");
        request.setExpiryYear("29");
        request.setCvv("123");

        PaymentResponse response = PaymentResponse.builder()
                .paymentId(8)
                .orderId(1001)
                .paymentMethod(PaymentMethod.BANKING)
                .paymentStatus(PaymentStatus.PAID)
                .orderStatus(OrderStatus.CONFIRMED)
                .message("Payment successful")
                .retryable(false)
                .paidAt(LocalDateTime.of(2026, 4, 5, 10, 20))
                .build();

        when(paymentService.processPayment(any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/payments/orders/1001/pay")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.paymentStatus").value("PAID"))
                .andExpect(jsonPath("$.data.orderStatus").value("confirmed"))
                .andExpect(jsonPath("$.data.message").value("Payment successful"));
    }

    @Test
    void processPayment_shouldReturnValidationErrorForMissingMethod() throws Exception {
        PaymentRequest request = new PaymentRequest();

        mockMvc.perform(post("/api/payments/orders/1001/pay")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void processPayment_shouldReturnGatewayFailure() throws Exception {
        PaymentRequest request = new PaymentRequest();
        request.setPaymentMethod(PaymentMethod.BANKING);

        when(paymentService.processPayment(any(), any()))
                .thenThrow(new PaymentGatewayException("Payment failed"));

        mockMvc.perform(post("/api/payments/orders/1001/pay")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Payment failed"));
    }

    @Test
    void processPayment_shouldReturnBadRequestForExpiredCheckoutSession() throws Exception {
        PaymentRequest request = new PaymentRequest();
        request.setPaymentMethod(PaymentMethod.COD);

        when(paymentService.processPayment(any(), any()))
                .thenThrow(new BadRequestException("Checkout session has expired"));

        mockMvc.perform(post("/api/payments/orders/1001/pay")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Checkout session has expired"));
    }

    // ================= PAYMENT STATUS =================
    @Test
    void getCustomerPaymentStatus_shouldReturnSuccessMessageWhenPaymentExists() throws Exception {
        CustomerPaymentStatusResponse response = CustomerPaymentStatusResponse.builder()
                .orderId(1001)
                .orderCode("ORD-1001")
                .orderStatus(OrderStatus.CONFIRMED)
                .orderTotalAmount(new BigDecimal("320.00"))
                .paymentInfoAvailable(true)
                .paymentStatus(CustomerPaymentState.PAID)
                .paymentMethod(PaymentMethod.VNPAY)
                .paymentDateTime(LocalDateTime.of(2026, 4, 5, 10, 30))
                .transactionReference("VNPAY-ABCDEFG12345")
                .paidAmount(new BigDecimal("320.00"))
                .retryAllowed(false)
                .build();

        when(paymentService.getCustomerPaymentStatus(1001)).thenReturn(response);

        mockMvc.perform(get("/api/payments/orders/1001/summary").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Payment status fetched successfully"))
                .andExpect(jsonPath("$.data.paymentStatus").value("paid"))
                .andExpect(jsonPath("$.data.transactionReference").value("VNPAY-ABCDEFG12345"));
    }

    @Test
    void getCustomerPaymentStatus_shouldReturnNotAvailableMessageWhenNoRecordExists() throws Exception {
        CustomerPaymentStatusResponse response = CustomerPaymentStatusResponse.builder()
                .orderId(1001)
                .orderCode("ORD-1001")
                .orderStatus(OrderStatus.PENDING)
                .orderTotalAmount(new BigDecimal("320.00"))
                .paymentInfoAvailable(false)
                .retryAllowed(false)
                .build();

        when(paymentService.getCustomerPaymentStatus(1001)).thenReturn(response);

        mockMvc.perform(get("/api/payments/orders/1001/summary").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Payment information not available"));
    }

    @Test
    void getCustomerPaymentStatus_shouldReturnForbiddenWhenOrderBelongsToAnotherCustomer() throws Exception {
        when(paymentService.getCustomerPaymentStatus(1002))
                .thenThrow(new ForbiddenException("You are not allowed to view this payment information"));

        mockMvc.perform(get("/api/payments/orders/1002/summary").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    @Test
    void getCustomerPaymentStatus_shouldReturnLoadErrorWhenUnexpectedFailureHappens() throws Exception {
        when(paymentService.getCustomerPaymentStatus(1001))
                .thenThrow(new PaymentStatusLoadException());

        mockMvc.perform(get("/api/payments/orders/1001/summary").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Unable to load payment status"));
    }
}