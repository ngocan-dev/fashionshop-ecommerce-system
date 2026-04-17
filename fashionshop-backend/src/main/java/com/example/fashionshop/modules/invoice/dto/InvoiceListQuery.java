package com.example.fashionshop.modules.invoice.dto;

import com.example.fashionshop.common.enums.InvoicePaymentStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class InvoiceListQuery {
    @Min(0)
    private int page = 0;

    @Min(1)
    @Max(100)
    private int size = 10;

    private InvoicePaymentStatus paymentStatus;
    private String keyword;
    private String sortBy = "issuedAt";
    private String sortDir = "desc";
}
