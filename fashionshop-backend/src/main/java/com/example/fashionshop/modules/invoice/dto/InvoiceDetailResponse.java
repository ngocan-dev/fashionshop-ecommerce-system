package com.example.fashionshop.modules.invoice.dto;

import com.example.fashionshop.common.enums.InvoicePaymentStatus;
import com.example.fashionshop.common.enums.PaymentMethod;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class InvoiceDetailResponse {
    private InvoiceSummary summary;
    private CustomerInfo customer;
    private List<InvoiceItem> items;
    private AdditionalInfo additional;

    @Data
    @Builder
    public static class InvoiceSummary {
        private Integer invoiceId;
        private String invoiceNumber;
        private Integer orderId;
        private String orderNumber;
        private LocalDateTime invoiceDate;
        private InvoicePaymentStatus paymentStatus;
        private PaymentMethod paymentMethod;
        private BigDecimal totalAmount;
        private BigDecimal subtotal;
        private BigDecimal shippingFee;
        private BigDecimal discountAmount;
        private BigDecimal taxAmount;
    }

    @Data
    @Builder
    public static class CustomerInfo {
        private String fullName;
        private String email;
        private String phone;
        private String billingAddress;
        private String shippingAddress;
    }

    @Data
    @Builder
    public static class InvoiceItem {
        private String productImageUrl;
        private String productName;
        private String sku;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;
        private String variant;
    }

    @Data
    @Builder
    public static class AdditionalInfo {
        private String transactionReference;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
