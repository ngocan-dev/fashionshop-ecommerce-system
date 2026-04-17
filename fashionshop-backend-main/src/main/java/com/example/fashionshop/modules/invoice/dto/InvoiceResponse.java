package com.example.fashionshop.modules.invoice.dto;

import com.example.fashionshop.common.enums.InvoicePaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class InvoiceResponse {
    private Integer id;
    private Integer orderId;
    private String invoiceNumber;
    private BigDecimal tax;
    private BigDecimal totalAmount;
    private String note;
    private InvoicePaymentStatus paymentStatus;
    private LocalDateTime issuedAt;
}
