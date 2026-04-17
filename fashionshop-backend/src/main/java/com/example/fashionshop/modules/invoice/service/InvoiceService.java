package com.example.fashionshop.modules.invoice.service;

import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.modules.invoice.dto.InvoiceDetailResponse;
import com.example.fashionshop.modules.invoice.dto.InvoiceListQuery;
import com.example.fashionshop.modules.invoice.dto.InvoiceResponse;
import com.example.fashionshop.modules.invoice.dto.InvoiceSummaryResponse;

public interface InvoiceService {
    InvoiceResponse getByOrderId(Integer orderId);

    InvoiceResponse getById(Integer invoiceId);

    InvoiceDetailResponse getMyInvoiceDetail(Integer invoiceId);

    PaginationResponse<InvoiceSummaryResponse> getManageInvoices(InvoiceListQuery query);

    InvoiceDetailResponse getManageInvoiceDetail(Integer invoiceId);
}
