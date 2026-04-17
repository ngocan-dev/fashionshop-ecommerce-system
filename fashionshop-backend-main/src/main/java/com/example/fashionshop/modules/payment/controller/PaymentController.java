package com.example.fashionshop.modules.payment.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.modules.payment.dto.CustomerPaymentStatusResponse;
import com.example.fashionshop.modules.payment.dto.PaymentRequest;
import com.example.fashionshop.modules.payment.dto.PaymentResponse;
import com.example.fashionshop.modules.payment.service.PaymentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasRole('CUSTOMER')")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/orders/{orderId}/pay")
    public ApiResponse<PaymentResponse> processPayment(@PathVariable @Positive Integer orderId,
                                                       @Valid @RequestBody PaymentRequest request) {
        return ApiResponse.success("Payment processed successfully", paymentService.processPayment(orderId, request));
    }

    @PostMapping
    public ApiResponse<PaymentResponse> processPaymentDeprecated(@Valid @RequestBody PaymentRequest request) {
        return ApiResponse.success("Payment processed successfully", paymentService.processPayment(request));
    }

    @GetMapping("/orders/{orderId}")
    public ApiResponse<PaymentResponse> getPaymentStatus(@PathVariable @Positive Integer orderId) {
        return ApiResponse.success("Payment status fetched successfully", paymentService.getPaymentStatus(orderId));
    }

    @GetMapping("/orders/{orderId}/summary")
    public ApiResponse<CustomerPaymentStatusResponse> getCustomerPaymentStatus(@PathVariable Integer orderId) {
        CustomerPaymentStatusResponse response = paymentService.getCustomerPaymentStatus(orderId);
        if (!response.isPaymentInfoAvailable()) {
            return ApiResponse.success("Payment information not available", response);
        }
        return ApiResponse.success("Payment status fetched successfully", response);
    }
}
