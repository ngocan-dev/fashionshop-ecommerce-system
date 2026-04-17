package com.example.fashionshop.common.mapper;

import com.example.fashionshop.modules.invoice.dto.InvoiceResponse;
import com.example.fashionshop.modules.invoice.entity.Invoice;

public final class InvoiceMapper {

    private InvoiceMapper() {
    }

    public static InvoiceResponse toResponse(Invoice invoice) {
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .orderId(invoice.getOrder().getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .tax(invoice.getTax())
                .totalAmount(invoice.getTotalAmount())
                .note(invoice.getNote())
                .paymentStatus(invoice.getPaymentStatus())
                .issuedAt(invoice.getIssuedAt())
                .build();
    }
}
