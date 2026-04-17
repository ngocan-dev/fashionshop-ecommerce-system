package com.example.fashionshop.modules.order.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.modules.order.dto.CancelOrderRequest;
import com.example.fashionshop.modules.order.dto.CancelOrderResponse;
import com.example.fashionshop.modules.order.dto.CheckoutSummaryResponse;
import com.example.fashionshop.modules.order.dto.CustomerOrderHistoryQuery;
import com.example.fashionshop.modules.order.dto.OrderDetailResponse;
import com.example.fashionshop.modules.order.dto.OrderListQuery;
import com.example.fashionshop.modules.order.dto.OrderResponse;
import com.example.fashionshop.modules.order.dto.OrderSummaryResponse;
import com.example.fashionshop.modules.order.dto.OrderStatusTrackingResponse;
import com.example.fashionshop.modules.order.dto.PlaceOrderRequest;
import com.example.fashionshop.modules.order.dto.UpdateCheckoutPaymentMethodRequest;
import com.example.fashionshop.modules.order.dto.UpdateOrderStatusRequest;
import com.example.fashionshop.modules.order.dto.UpdateOrderStatusResponse;
import com.example.fashionshop.modules.order.service.OrderService;
import com.example.fashionshop.modules.payment.dto.CustomerPaymentStatusResponse;
import com.example.fashionshop.modules.payment.service.PaymentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Validated
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;

    @GetMapping("/checkout-summary")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ApiResponse<CheckoutSummaryResponse> checkoutSummary() {
        CheckoutSummaryResponse response = orderService.getCheckoutSummary();
        String message = Boolean.TRUE.equals(response.getEmpty())
                ? "Cart is empty"
                : "Checkout summary fetched successfully";
        return ApiResponse.success(message, response);
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ApiResponse<OrderResponse> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        return ApiResponse.success("Order placed successfully", orderService.placeOrder(request));
    }

    @PatchMapping("/checkout/payment-method")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ApiResponse<CheckoutSummaryResponse> updateCheckoutPaymentMethod(
            @Valid @RequestBody UpdateCheckoutPaymentMethodRequest request) {
        return ApiResponse.success(
                "Payment method selected successfully",
                orderService.updateCheckoutPaymentMethod(request)
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<PaginationResponse<OrderSummaryResponse>> orderList(
            @Valid @ModelAttribute OrderListQuery query) {

        PaginationResponse<OrderSummaryResponse> response =
                orderService.getManageOrderSummaries(query);

        String message = response.getItems().isEmpty()
                ? "No orders found"
                : "Order list fetched successfully";

        return ApiResponse.success(message, response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ApiResponse<List<OrderResponse>> myOrders() {
        return ApiResponse.success("Orders fetched successfully", orderService.getMyOrders());
    }

    @GetMapping("/my/history")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ApiResponse<PaginationResponse<OrderSummaryResponse>> myOrderHistory(
            @Valid @ModelAttribute CustomerOrderHistoryQuery query) {

        PaginationResponse<OrderSummaryResponse> response =
                orderService.getMyOrderHistory(query);

        String message = response.getItems().isEmpty()
                ? "No order history available"
                : "Order history fetched successfully";

        return ApiResponse.success(message, response);
    }

    @GetMapping("/my/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ApiResponse<OrderDetailResponse> myOrderDetail(
            @PathVariable @Positive Integer orderId) {

        return ApiResponse.success(
                "Order detail fetched successfully",
                orderService.getMyOrderDetail(orderId)
        );
    }

    // ✅ Payment status
    @GetMapping("/my/{orderId}/payment")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ApiResponse<CustomerPaymentStatusResponse> myOrderPaymentStatus(
            @PathVariable @Positive Integer orderId) {

        CustomerPaymentStatusResponse response = paymentService.getCustomerPaymentStatus(orderId);

        if (!response.isPaymentInfoAvailable()) {
            return ApiResponse.success("Payment information not available", response);
        }

        return ApiResponse.success("Payment status fetched successfully", response);
    }

    // ✅ Order tracking status
    @GetMapping("/my/{orderId}/status")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ApiResponse<OrderStatusTrackingResponse> myOrderStatus(
            @PathVariable @Positive Integer orderId) {

        return ApiResponse.success(
                "Order status fetched successfully",
                orderService.getMyOrderTrackingStatus(orderId)
        );
    }

    @PatchMapping("/my/{orderId}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ApiResponse<CancelOrderResponse> cancelMyOrder(
            @PathVariable @Positive Integer orderId,
            @Valid @RequestBody(required = false) CancelOrderRequest request) {

        CancelOrderRequest safeRequest =
                request == null ? new CancelOrderRequest() : request;

        return ApiResponse.success(
                "Order cancelled successfully",
                orderService.cancelMyOrder(orderId, safeRequest)
        );
    }

    @GetMapping("/manage")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<List<OrderResponse>> allOrders() {
        return ApiResponse.success("Orders fetched successfully", orderService.getAllOrders());
    }

    @GetMapping("/manage/{orderId}")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<OrderDetailResponse> orderDetail(
            @PathVariable @Positive Integer orderId) {

        return ApiResponse.success(
                "Order detail fetched successfully",
                orderService.getOrderDetail(orderId)
        );
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<OrderDetailResponse> orderDetailById(
            @PathVariable @Positive(message = "Invalid order id") Integer orderId) {

        return ApiResponse.success(
                "Order detail fetched successfully",
                orderService.getOrderDetail(orderId)
        );
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<UpdateOrderStatusResponse> updateStatus(
            @PathVariable @Positive Integer orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {

        return ApiResponse.success(
                "Order status updated successfully",
                orderService.updateOrderStatus(orderId, request)
        );
    }

    @PatchMapping("/manage/{orderId}/status")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<UpdateOrderStatusResponse> updateManageStatus(
            @PathVariable @Positive Integer orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {

        return updateStatus(orderId, request);
    }
}