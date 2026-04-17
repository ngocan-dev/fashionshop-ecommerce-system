package com.example.fashionshop.modules.invoice.dto;

import com.example.fashionshop.common.enums.InvoicePaymentStatus;
import com.example.fashionshop.common.enums.PaymentMethod;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class InvoiceSummaryResponse {
    private Integer id;
    private String invoiceNumber;
    private Integer orderId;
    private LocalDateTime invoiceDate;

    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private BigDecimal totalAmount;
    private InvoicePaymentStatus paymentStatus;

    private PaymentMethod paymentMethod;
    private String invoiceStatus;
    private String detailPath;
    private LocalDateTime dueDate;
    private LocalDateTime updatedAt;
}
