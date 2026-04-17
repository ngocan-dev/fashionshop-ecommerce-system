package com.example.fashionshop.modules.order.controller;

import com.example.fashionshop.common.enums.OrderStatus;
import com.example.fashionshop.common.enums.PaymentMethod;
import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.GlobalExceptionHandler;
import com.example.fashionshop.common.exception.OrderDetailLoadException;
import com.example.fashionshop.common.exception.OrderListLoadException;
import com.example.fashionshop.common.exception.OrderStatusLoadException;
import com.example.fashionshop.common.exception.OrderStatusUpdateException;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.modules.order.dto.CancelOrderResponse;
import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.modules.order.dto.OrderCustomerInfoResponse;
import com.example.fashionshop.modules.order.dto.OrderDetailItemResponse;
import com.example.fashionshop.modules.order.dto.OrderDetailResponse;
import com.example.fashionshop.modules.order.dto.OrderSummaryResponse;
import com.example.fashionshop.modules.order.dto.CheckoutSummaryResponse;
import com.example.fashionshop.modules.order.dto.OrderStatusTrackingResponse;
import com.example.fashionshop.modules.order.dto.OrderTrackingInfoResponse;
import com.example.fashionshop.modules.order.dto.OrderTrackingStepResponse;
import com.example.fashionshop.modules.order.dto.UpdateOrderStatusResponse;
import com.example.fashionshop.modules.order.service.OrderService;
import com.example.fashionshop.modules.payment.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({GlobalExceptionHandler.class, com.example.fashionshop.config.TestSecurityConfig.class})
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @MockBean
    private PaymentService paymentService;

    @Test
    void orderDetailById_shouldReturnOrderDetailsForAdminOrStaff() throws Exception {
        OrderDetailResponse detailResponse = buildOrderDetailResponse();

        when(orderService.getOrderDetail(1001)).thenReturn(detailResponse);

        mockMvc.perform(get("/api/orders/1001").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Order detail fetched successfully"))
                .andExpect(jsonPath("$.data.summary.orderId").value(1001))
                .andExpect(jsonPath("$.data.summary.paymentStatus").value("PAID"))
                .andExpect(jsonPath("$.data.customer.fullName").value("Jane Customer"))
                .andExpect(jsonPath("$.data.items[0].productName").value("Classic Blazer"));
    }

    @Test
    void orderDetailById_shouldReturnNotFoundWhenOrderDoesNotExist() throws Exception {
        when(orderService.getOrderDetail(9999)).thenThrow(new ResourceNotFoundException("Order not found"));

        mockMvc.perform(get("/api/orders/9999").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Order not found"));
    }

    @Test
    void orderDetailById_shouldReturnRetrieveFailureWhenServiceFails() throws Exception {
        when(orderService.getOrderDetail(1001)).thenThrow(new OrderDetailLoadException());

        mockMvc.perform(get("/api/orders/1001").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Failed to retrieve order details"));
    }

    @Test
    void orderDetailById_shouldReturnAccessDeniedWhenPermissionIsMissing() throws Exception {
        when(orderService.getOrderDetail(1001)).thenThrow(new AccessDeniedException("Access denied"));

        mockMvc.perform(get("/api/orders/1001").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    @Test
    void orderDetailById_shouldReturnBadRequestWhenOrderIdIsInvalid() throws Exception {
        mockMvc.perform(get("/api/orders/0").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid order id"));
    }

    @Test
    void myOrderHistory_shouldReturnOrderHistoryWhenOrdersExist() throws Exception {
        PaginationResponse<OrderSummaryResponse> response = PaginationResponse.<OrderSummaryResponse>builder()
                .items(List.of(OrderSummaryResponse.builder()
                        .id(1001)
                        .orderId(1001)
                        .orderCode("INV-AB12CD34")
                        .orderDate(LocalDateTime.of(2026, 3, 20, 10, 30))
                        .orderStatus(OrderStatus.CONFIRMED)
                        .paymentStatus("PAID")
                        .paymentMethod("COD")
                        .totalAmount(new BigDecimal("320.00"))
                        .itemCount(2)
                        .shippingStatus("PREPARING")
                        .detailPath("/account/orders/1001")
                        .updatedAt(LocalDateTime.of(2026, 3, 21, 12, 0))
                        .build()))
                .page(0)
                .size(10)
                .totalItems(1)
                .totalPages(1)
                .build();

        when(orderService.getMyOrderHistory(any())).thenReturn(response);

        mockMvc.perform(get("/api/orders/my/history").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Order history fetched successfully"))
                .andExpect(jsonPath("$.data.items[0].orderId").value(1001))
                .andExpect(jsonPath("$.data.items[0].totalAmount").value(320.00))
                .andExpect(jsonPath("$.data.items[0].detailPath").value("/account/orders/1001"))
                .andExpect(jsonPath("$.data.items[0].orderStatus").value("confirmed"));
    }

    @Test
    void myOrderHistory_shouldReturnEmptyMessageWhenNoOrdersFound() throws Exception {
        PaginationResponse<OrderSummaryResponse> response = PaginationResponse.<OrderSummaryResponse>builder()
                .items(List.of())
                .page(0)
                .size(10)
                .totalItems(0)
                .totalPages(0)
                .build();

        when(orderService.getMyOrderHistory(any())).thenReturn(response);

        mockMvc.perform(get("/api/orders/my/history").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("No order history available"))
                .andExpect(jsonPath("$.data.items").isEmpty());
    }

    @Test
    void myOrderHistory_shouldReturnFailureMessageWhenServiceThrowsError() throws Exception {
        when(orderService.getMyOrderHistory(any())).thenThrow(new OrderListLoadException("Unable to load order history"));

        mockMvc.perform(get("/api/orders/my/history").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Unable to load order history"));
    }


    @Test
    void myOrderStatus_shouldReturnTrackingStatus() throws Exception {
        OrderStatusTrackingResponse response = OrderStatusTrackingResponse.builder()
                .summary(OrderSummaryResponse.builder()
                        .orderId(1001)
                        .orderCode("INV-AB12CD34")
                        .orderStatus(OrderStatus.PROCESSING)
                        .orderDate(LocalDateTime.of(2026, 4, 2, 9, 0))
                        .build())
                .tracking(OrderTrackingInfoResponse.builder()
                        .currentStatus(OrderStatus.PROCESSING)
                        .progressSteps(List.of(OrderTrackingStepResponse.builder()
                                .code("processing")
                                .label("Processing")
                                .completed(true)
                                .current(true)
                                .updatedAt(LocalDateTime.of(2026, 4, 3, 10, 0))
                                .build()))
                        .statusHistory(List.of())
                        .build())
                .build();

        when(orderService.getMyOrderTrackingStatus(1001)).thenReturn(response);

        mockMvc.perform(get("/api/orders/my/1001/status").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Order status fetched successfully"))
                .andExpect(jsonPath("$.data.summary.orderId").value(1001))
                .andExpect(jsonPath("$.data.tracking.currentStatus").value("processing"));
    }

    @Test
    void myOrderStatus_shouldReturnNotFoundWhenOrderDoesNotExist() throws Exception {
        when(orderService.getMyOrderTrackingStatus(9999))
                .thenThrow(new ResourceNotFoundException("Order not found"));

        mockMvc.perform(get("/api/orders/my/9999/status").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Order not found"));
    }

    @Test
    void myOrderStatus_shouldReturnFailureMessageWhenServiceErrors() throws Exception {
        when(orderService.getMyOrderTrackingStatus(1001)).thenThrow(new OrderStatusLoadException());

        mockMvc.perform(get("/api/orders/my/1001/status").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Unable to load order status"));
    }

    @Test
    void updateStatus_shouldReturnUpdatedStatus() throws Exception {
        UpdateOrderStatusResponse response = UpdateOrderStatusResponse.builder()
                .orderId(1001)
                .previousStatus(OrderStatus.CONFIRMED)
                .currentStatus(OrderStatus.PROCESSING)
                .allowedNextStatuses(List.of(OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.CANCELLED))
                .updatedAt(LocalDateTime.of(2026, 4, 1, 10, 10))
                .updatedByUserId(9)
                .build();

        when(orderService.updateOrderStatus(any(), any())).thenReturn(response);

        mockMvc.perform(patch("/api/orders/1001/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of("status", "processing"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Order status updated successfully"))
                .andExpect(jsonPath("$.data.orderId").value(1001))
                .andExpect(jsonPath("$.data.currentStatus").value("processing"));
    }

    @Test
    void updateStatus_shouldReturnBadRequestForInvalidTransition() throws Exception {
        when(orderService.updateOrderStatus(any(), any()))
                .thenThrow(new BadRequestException("Invalid status transition from shipped to cancelled"));

        mockMvc.perform(patch("/api/orders/1001/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of("status", "cancelled"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid status transition from shipped to cancelled"));
    }

    @Test
    void updateStatus_shouldReturnFailureMessageWhenServiceErrors() throws Exception {
        when(orderService.updateOrderStatus(any(), any())).thenThrow(new OrderStatusUpdateException());

        mockMvc.perform(patch("/api/orders/1001/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of("status", "processing"))))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Order status update failed"));
    }

    @Test
    void updateCheckoutPaymentMethod_shouldSaveSelectedMethod() throws Exception {
        CheckoutSummaryResponse response = CheckoutSummaryResponse.builder()
                .cartId(7)
                .empty(false)
                .message("Checkout summary fetched successfully")
                .availablePaymentMethods(List.of(PaymentMethod.COD, PaymentMethod.BANKING))
                .selectedPaymentMethod(PaymentMethod.COD)
                .items(List.of())
                .totalItems(2)
                .distinctItemCount(1)
                .subtotal(new BigDecimal("120.00"))
                .shippingFee(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .finalTotal(new BigDecimal("120.00"))
                .build();

        when(orderService.updateCheckoutPaymentMethod(any())).thenReturn(response);

        mockMvc.perform(patch("/api/orders/checkout/payment-method")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of("paymentMethod", "COD"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Payment method selected successfully"))
                .andExpect(jsonPath("$.data.selectedPaymentMethod").value("COD"));
    }

    @Test
    void updateCheckoutPaymentMethod_shouldReturnValidationMessageWhenMissingPaymentMethod() throws Exception {
        mockMvc.perform(patch("/api/orders/checkout/payment-method")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Please fill in all required fields"));
    }

    @Test
    void cancelMyOrder_shouldReturnCancelledOrder() throws Exception {
        CancelOrderResponse response = CancelOrderResponse.builder()
                .orderId(1001)
                .status(OrderStatus.CANCELLED)
                .cancellationReason("Created duplicated order")
                .updatedAt(LocalDateTime.of(2026, 4, 2, 12, 10))
                .build();

        when(orderService.cancelMyOrder(any(), any())).thenReturn(response);

        mockMvc.perform(patch("/api/orders/my/1001/cancel")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of("reason", "Created duplicated order"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Order cancelled successfully"))
                .andExpect(jsonPath("$.data.orderId").value(1001))
                .andExpect(jsonPath("$.data.status").value("cancelled"));
    }

    @Test
    void cancelMyOrder_shouldReturnCannotCancelMessageWhenOrderIsShipped() throws Exception {
        when(orderService.cancelMyOrder(any(), any())).thenThrow(new BadRequestException("Order cannot be cancelled"));

        mockMvc.perform(patch("/api/orders/my/1001/cancel")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of("reason", "Need to update address"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Order cannot be cancelled"));
    }

    private OrderDetailResponse buildOrderDetailResponse() {
        return OrderDetailResponse.builder()
                .summary(OrderSummaryResponse.builder()
                        .orderId(1001)
                        .orderCode("INV-AB12CD34")
                        .orderDate(LocalDateTime.of(2026, 3, 20, 10, 30))
                        .orderStatus(OrderStatus.CONFIRMED)
                        .paymentStatus("PAID")
                        .paymentMethod("MOMO")
                        .totalAmount(new BigDecimal("320.00"))
                        .subtotal(new BigDecimal("320.00"))
                        .shippingFee(BigDecimal.ZERO)
                        .discountAmount(BigDecimal.ZERO)
                        .build())
                .customer(OrderCustomerInfoResponse.builder()
                        .fullName("Jane Customer")
                        .email("jane@example.com")
                        .phoneNumber("0900123456")
                        .shippingAddress("123 Main St, Springfield")
                        .billingAddress(null)
                        .build())
                .items(List.of(OrderDetailItemResponse.builder()
                        .productId(301)
                        .productImage("https://cdn.example.com/products/301.jpg")
                        .productName("Classic Blazer")
                        .sku(null)
                        .quantity(2)
                        .unitPrice(new BigDecimal("160.00"))
                        .lineTotal(new BigDecimal("320.00"))
                        .variant(null)
                        .build()))
                .additionalInfo(com.example.fashionshop.modules.order.dto.OrderAdditionalInfoResponse.builder()
                        .customerNote(null)
                        .deliveryMethod(null)
                        .internalNote("Invoice created automatically when placing order")
                        .lastUpdatedAt(LocalDateTime.of(2026, 3, 20, 10, 30))
                        .build())
                .build();
    }
}
