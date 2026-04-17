package com.example.fashionshop.common.mapper;

import com.example.fashionshop.common.enums.OrderStatus;
import com.example.fashionshop.modules.order.dto.OrderStatusHistoryResponse;
import com.example.fashionshop.modules.order.dto.OrderTrackingInfoResponse;
import com.example.fashionshop.modules.order.dto.OrderTrackingStepResponse;
import com.example.fashionshop.modules.order.entity.Order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public final class OrderTrackingMapper {

    private static final List<OrderStatus> TRACKING_FLOW = List.of(
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PROCESSING,
            OrderStatus.SHIPPED,
            OrderStatus.DELIVERED
    );

    private OrderTrackingMapper() {
    }

    public static OrderTrackingInfoResponse toTrackingInfo(Order order) {
        OrderStatus currentStatus = order.getStatus();
        LocalDateTime updatedAt = order.getUpdatedAt() != null ? order.getUpdatedAt() : order.getCreatedAt();

        return OrderTrackingInfoResponse.builder()
                .currentStatus(currentStatus)
                .lastStatusUpdateAt(updatedAt)
                .shippingTrackingNote(resolveShippingTrackingNote(currentStatus))
                .estimatedDeliveryDate(resolveEstimatedDeliveryDate(order))
                .cancellationNote(resolveCancellationNote(order))
                .progressSteps(buildProgressSteps(order))
                .statusHistory(buildStatusHistory(order))
                .build();
    }

    private static String resolveShippingTrackingNote(OrderStatus currentStatus) {
        if (currentStatus == null) {
            return null;
        }

        return switch (currentStatus) {
            case SHIPPED -> "Your package is in transit";
            case DELIVERED, COMPLETED -> "Package has been delivered";
            case CANCELLED -> null;
            default -> "Preparing shipment";
        };
    }

    private static LocalDateTime resolveEstimatedDeliveryDate(Order order) {
        if (order.getStatus() == null) {
            return null;
        }

        return switch (order.getStatus()) {
            case PENDING, CONFIRMED, PROCESSING -> order.getCreatedAt() != null ? order.getCreatedAt().plusDays(3) : null;
            case SHIPPED -> order.getUpdatedAt() != null ? order.getUpdatedAt().plusDays(2) : null;
            case DELIVERED, COMPLETED, CANCELLED -> null;
        };
    }

    private static String resolveCancellationNote(Order order) {
        if (order.getStatus() != OrderStatus.CANCELLED) {
            return null;
        }
        return order.getCancellationReason();
    }

    private static List<OrderTrackingStepResponse> buildProgressSteps(Order order) {
        List<OrderTrackingStepResponse> steps = new ArrayList<>();
        OrderStatus currentStatus = order.getStatus();

        int currentIndex = TRACKING_FLOW.indexOf(currentStatus);
        if (currentStatus == OrderStatus.COMPLETED) {
            currentIndex = TRACKING_FLOW.indexOf(OrderStatus.DELIVERED);
        }

        for (int i = 0; i < TRACKING_FLOW.size(); i++) {
            OrderStatus status = TRACKING_FLOW.get(i);
            boolean completed = currentStatus == OrderStatus.CANCELLED
                    ? status == OrderStatus.PENDING
                    : currentIndex >= i;
            boolean current = currentStatus != null
                    && (currentStatus == status || (currentStatus == OrderStatus.COMPLETED && status == OrderStatus.DELIVERED));

            steps.add(OrderTrackingStepResponse.builder()
                    .code(status.getValue())
                    .label(toStatusLabel(status))
                    .completed(completed)
                    .current(current)
                    .updatedAt(completed ? resolveStepTime(order, status, currentStatus) : null)
                    .build());
        }

        if (currentStatus == OrderStatus.CANCELLED) {
            steps.add(OrderTrackingStepResponse.builder()
                    .code(OrderStatus.CANCELLED.getValue())
                    .label("Cancelled")
                    .completed(true)
                    .current(true)
                    .updatedAt(order.getUpdatedAt())
                    .build());
        }

        return steps;
    }

    private static LocalDateTime resolveStepTime(Order order, OrderStatus stepStatus, OrderStatus currentStatus) {
        if (stepStatus == OrderStatus.PENDING) {
            return order.getCreatedAt();
        }
        if (stepStatus == currentStatus || (currentStatus == OrderStatus.COMPLETED && stepStatus == OrderStatus.DELIVERED)) {
            return order.getUpdatedAt();
        }
        return null;
    }

    private static List<OrderStatusHistoryResponse> buildStatusHistory(Order order) {
        List<OrderStatusHistoryResponse> history = new ArrayList<>();

        history.add(OrderStatusHistoryResponse.builder()
                .status(OrderStatus.PENDING)
                .label("Order placed")
                .updatedAt(order.getCreatedAt())
                .note(null)
                .build());

        if (order.getStatus() != null && order.getStatus() != OrderStatus.PENDING) {
            history.add(OrderStatusHistoryResponse.builder()
                    .status(order.getStatus())
                    .label(toStatusLabel(order.getStatus()))
                    .updatedAt(order.getUpdatedAt())
                    .note(order.getStatus() == OrderStatus.CANCELLED ? order.getCancellationReason() : null)
                    .build());
        }

        return history;
    }

    private static String toStatusLabel(OrderStatus status) {
        return switch (status) {
            case PENDING -> "Order placed";
            case CONFIRMED -> "Confirmed";
            case PROCESSING -> "Processing";
            case SHIPPED -> "Shipped";
            case DELIVERED -> "Delivered";
            case COMPLETED -> "Completed";
            case CANCELLED -> "Cancelled";
        };
    }
}
