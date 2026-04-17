package com.example.fashionshop.modules.invoice.controller;

import com.example.fashionshop.common.enums.InvoicePaymentStatus;
import com.example.fashionshop.common.enums.PaymentMethod;
import com.example.fashionshop.common.exception.ForbiddenException;
import com.example.fashionshop.common.exception.GlobalExceptionHandler;
import com.example.fashionshop.common.exception.InvoiceDetailLoadException;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.modules.invoice.dto.InvoiceDetailResponse;
import com.example.fashionshop.modules.invoice.service.InvoiceService;
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

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(InvoiceController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({GlobalExceptionHandler.class, com.example.fashionshop.config.TestSecurityConfig.class})
class InvoiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InvoiceService invoiceService;

    @Test
    void getMyInvoiceDetail_shouldReturnInvoiceDetailsForCustomer() throws Exception {
        InvoiceDetailResponse response = InvoiceDetailResponse.builder()
                .summary(InvoiceDetailResponse.InvoiceSummary.builder()
                        .invoiceId(10)
                        .invoiceNumber("INV-10")
                        .orderId(1001)
                        .orderNumber("ORD-1001")
                        .invoiceDate(LocalDateTime.of(2026, 4, 5, 10, 0))
                        .paymentStatus(InvoicePaymentStatus.PAID)
                        .paymentMethod(PaymentMethod.VNPAY)
                        .subtotal(new BigDecimal("200.00"))
                        .shippingFee(new BigDecimal("10.00"))
                        .discountAmount(new BigDecimal("20.00"))
                        .taxAmount(new BigDecimal("5.00"))
                        .totalAmount(new BigDecimal("195.00"))
                        .build())
                .customer(InvoiceDetailResponse.CustomerInfo.builder()
                        .fullName("Jane Customer")
                        .phone("0123456789")
                        .billingAddress("123 Example St")
                        .shippingAddress("123 Example St")
                        .build())
                .items(List.of(InvoiceDetailResponse.InvoiceItem.builder()
                        .productName("Women Blazer")
                        .quantity(1)
                        .unitPrice(new BigDecimal("200.00"))
                        .lineTotal(new BigDecimal("200.00"))
                        .build()))
                .additional(InvoiceDetailResponse.AdditionalInfo.builder()
                        .transactionReference("TXN-202604050001")
                        .notes("Thank you")
                        .createdAt(LocalDateTime.of(2026, 4, 5, 10, 0))
                        .updatedAt(LocalDateTime.of(2026, 4, 5, 10, 5))
                        .build())
                .build();

        when(invoiceService.getMyInvoiceDetail(10)).thenReturn(response);

        mockMvc.perform(get("/api/invoices/my/10").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.summary.invoiceNumber").value("INV-10"))
                .andExpect(jsonPath("$.data.summary.paymentStatus").value("PAID"))
                .andExpect(jsonPath("$.data.items[0].productName").value("Women Blazer"));
    }

    @Test
    void getMyInvoiceDetail_shouldReturnNotFoundWhenInvoiceDoesNotExist() throws Exception {
        when(invoiceService.getMyInvoiceDetail(999)).thenThrow(new ResourceNotFoundException("Invoice not found"));

        mockMvc.perform(get("/api/invoices/my/999").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invoice not found"));
    }

    @Test
    void getMyInvoiceDetail_shouldReturnForbiddenWhenInvoiceBelongsToAnotherCustomer() throws Exception {
        when(invoiceService.getMyInvoiceDetail(11))
                .thenThrow(new ForbiddenException("You are not allowed to view this invoice"));

        mockMvc.perform(get("/api/invoices/my/11").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    @Test
    void getMyInvoiceDetail_shouldReturnLoadErrorWhenUnexpectedFailureHappens() throws Exception {
        when(invoiceService.getMyInvoiceDetail(10)).thenThrow(new InvoiceDetailLoadException(new RuntimeException("DB down")));

        mockMvc.perform(get("/api/invoices/my/10").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Unable to load invoice details"));
    }
}
