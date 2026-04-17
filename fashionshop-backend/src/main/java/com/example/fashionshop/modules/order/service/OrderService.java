package com.example.fashionshop.modules.order.service;

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

import java.util.List;

public interface OrderService {
    CheckoutSummaryResponse getCheckoutSummary();

    CheckoutSummaryResponse updateCheckoutPaymentMethod(UpdateCheckoutPaymentMethodRequest request);

    OrderResponse placeOrder(PlaceOrderRequest request);

    List<OrderResponse> getMyOrders();

    PaginationResponse<OrderSummaryResponse> getMyOrderHistory(CustomerOrderHistoryQuery query);

    OrderDetailResponse getMyOrderDetail(Integer orderId);

    OrderStatusTrackingResponse getMyOrderTrackingStatus(Integer orderId);

    CancelOrderResponse cancelMyOrder(Integer orderId, CancelOrderRequest request);

    List<OrderResponse> getAllOrders();

    PaginationResponse<OrderSummaryResponse> getManageOrderSummaries(OrderListQuery query);

    OrderDetailResponse getOrderDetail(Integer orderId);

    UpdateOrderStatusResponse updateOrderStatus(Integer orderId, UpdateOrderStatusRequest request);
}
