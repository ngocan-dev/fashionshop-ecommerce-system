package com.example.fashionshop.modules.invoice.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.modules.invoice.dto.InvoiceDetailResponse;
import com.example.fashionshop.modules.invoice.dto.InvoiceListQuery;
import com.example.fashionshop.modules.invoice.dto.InvoiceResponse;
import com.example.fashionshop.modules.invoice.dto.InvoiceSummaryResponse;
import com.example.fashionshop.modules.invoice.service.InvoiceService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Validated
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/orders/{orderId}")
    @PreAuthorize("hasAnyRole('CUSTOMER','STAFF','ADMIN')")
    public ApiResponse<InvoiceResponse> getByOrderId(@PathVariable Integer orderId) {
        return ApiResponse.success("Invoice fetched successfully", invoiceService.getByOrderId(orderId));
    }

    @GetMapping("/{invoiceId}")
    @PreAuthorize("hasAnyRole('CUSTOMER','STAFF','ADMIN')")
    public ApiResponse<InvoiceResponse> getById(@PathVariable @Positive Integer invoiceId) {
        return ApiResponse.success("Invoice fetched successfully", invoiceService.getById(invoiceId));
    }

    @GetMapping("/my/{invoiceId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ApiResponse<InvoiceDetailResponse> getMyInvoiceDetail(@PathVariable @Positive Integer invoiceId) {
        return ApiResponse.success("Invoice detail fetched successfully", invoiceService.getMyInvoiceDetail(invoiceId));
    }

    @GetMapping("/manage")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<PaginationResponse<InvoiceSummaryResponse>> manageList(@Valid @ModelAttribute InvoiceListQuery query) {
        PaginationResponse<InvoiceSummaryResponse> response = invoiceService.getManageInvoices(query);
        String message = response.getItems().isEmpty() ? "No invoices available" : "Invoice list fetched successfully";
        return ApiResponse.success(message, response);
    }

    @GetMapping("/manage/{invoiceId}")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<InvoiceDetailResponse> manageDetail(@PathVariable @Positive Integer invoiceId) {
        return ApiResponse.success("Invoice detail fetched successfully", invoiceService.getManageInvoiceDetail(invoiceId));
    }
}
