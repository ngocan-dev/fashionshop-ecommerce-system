package com.example.fashionshop.modules.order.service;

import com.example.fashionshop.common.enums.OrderStatus;
import com.example.fashionshop.common.enums.PaymentMethod;
import com.example.fashionshop.common.enums.PaymentStatus;
import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.ForbiddenException;
import com.example.fashionshop.common.exception.OrderCancellationException;
import com.example.fashionshop.common.exception.OrderDetailLoadException;
import com.example.fashionshop.common.exception.OrderListLoadException;
import com.example.fashionshop.common.exception.OrderPlacementException;
import com.example.fashionshop.common.exception.OrderStatusUpdateException;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.common.exception.UnauthorizedException;
import com.example.fashionshop.common.exception.OrderStatusLoadException;
import com.example.fashionshop.common.mapper.OrderMapper;
import com.example.fashionshop.common.mapper.OrderTrackingMapper;
import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.common.util.SecurityUtil;
import com.example.fashionshop.modules.cart.entity.Cart;
import com.example.fashionshop.modules.cart.entity.CartItem;
import com.example.fashionshop.modules.cart.repository.CartItemRepository;
import com.example.fashionshop.modules.cart.repository.CartRepository;
import com.example.fashionshop.modules.invoice.entity.Invoice;
import com.example.fashionshop.modules.invoice.repository.InvoiceRepository;
import com.example.fashionshop.modules.order.observer.OrderEvent;
import com.example.fashionshop.modules.order.observer.OrderEventPublisher;
import com.example.fashionshop.modules.order.observer.OrderEventType;
import com.example.fashionshop.modules.order.pricing.PriceCalculator;
import com.example.fashionshop.modules.order.pricing.PriceCalculatorBuilder;
import com.example.fashionshop.modules.order.state.OrderStateFactory;
import com.example.fashionshop.modules.order.dto.CancelOrderRequest;
import com.example.fashionshop.modules.order.dto.CancelOrderResponse;
import com.example.fashionshop.modules.order.dto.CheckoutSummaryItemResponse;
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
import com.example.fashionshop.modules.order.entity.Order;
import com.example.fashionshop.modules.order.entity.OrderItem;
import com.example.fashionshop.modules.order.repository.OrderItemRepository;
import com.example.fashionshop.modules.order.repository.OrderRepository;
import com.example.fashionshop.modules.payment.entity.Payment;
import com.example.fashionshop.modules.payment.repository.PaymentRepository;
import com.example.fashionshop.modules.product.entity.Product;
import com.example.fashionshop.modules.product.repository.ProductRepository;
import com.example.fashionshop.modules.user.entity.User;
import com.example.fashionshop.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static com.example.fashionshop.common.enums.InvoicePaymentStatus.PENDING;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final BigDecimal ZERO = BigDecimal.ZERO;
    private static final BigDecimal DEFAULT_SHIPPING_FEE = ZERO;
    private static final BigDecimal DEFAULT_DISCOUNT = ZERO;
    private static final List<PaymentMethod> CHECKOUT_PAYMENT_METHODS = List.of(
            PaymentMethod.COD,
            PaymentMethod.BANKING
    );

    private static final Set<OrderStatus> CUSTOMER_NON_CANCELLABLE_STATUSES =
            EnumSet.of(
                    OrderStatus.SHIPPED,
                    OrderStatus.DELIVERED,
                    OrderStatus.COMPLETED,
                    OrderStatus.CANCELLED
            );

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final OrderEventPublisher orderEventPublisher;

    @Override
    public CheckoutSummaryResponse getCheckoutSummary() {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUser(user).orElse(null);

        if (cart == null) {
            return CheckoutSummaryResponse.builder()
                    .empty(true)
                    .message("Cart is empty")
                    .customerName(user.getFullName())
                    .customerPhone(user.getPhoneNumber())
                    .suggestedShippingAddress(user.getAddress())
                    .availablePaymentMethods(CHECKOUT_PAYMENT_METHODS)
                    .selectedPaymentMethod(null)
                    .items(List.of())
                    .totalItems(0)
                    .distinctItemCount(0)
                    .subtotal(ZERO)
                    .shippingFee(DEFAULT_SHIPPING_FEE)
                    .discountAmount(DEFAULT_DISCOUNT)
                    .finalTotal(ZERO)
                    .build();
        }

        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        if (cartItems.isEmpty()) {
            return CheckoutSummaryResponse.builder()
                    .cartId(cart.getId())
                    .empty(true)
                    .message("Cart is empty")
                    .customerName(user.getFullName())
                    .customerPhone(user.getPhoneNumber())
                    .suggestedShippingAddress(user.getAddress())
                    .availablePaymentMethods(CHECKOUT_PAYMENT_METHODS)
                    .selectedPaymentMethod(resolveCheckoutPaymentMethod(cart))
                    .items(List.of())
                    .totalItems(0)
                    .distinctItemCount(0)
                    .subtotal(ZERO)
                    .shippingFee(DEFAULT_SHIPPING_FEE)
                    .discountAmount(DEFAULT_DISCOUNT)
                    .finalTotal(ZERO)
                    .build();
        }

        List<CheckoutSummaryItemResponse> items = cartItems.stream()
                .map(this::toCheckoutItem)
                .toList();

        BigDecimal subtotal = items.stream()
                .map(CheckoutSummaryItemResponse::getLineTotal)
                .reduce(ZERO, BigDecimal::add);

        int totalItems = items.stream()
                .mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                .sum();

        return CheckoutSummaryResponse.builder()
                .cartId(cart.getId())
                .empty(false)
                .message("Checkout summary fetched successfully")
                .customerName(user.getFullName())
                .customerPhone(user.getPhoneNumber())
                .suggestedShippingAddress(user.getAddress())
                .availablePaymentMethods(CHECKOUT_PAYMENT_METHODS)
                .selectedPaymentMethod(resolveCheckoutPaymentMethod(cart))
                .items(items)
                .totalItems(totalItems)
                .distinctItemCount(items.size())
                .subtotal(subtotal)
                .shippingFee(DEFAULT_SHIPPING_FEE)
                .discountAmount(DEFAULT_DISCOUNT)
                .finalTotal(PriceCalculatorBuilder.base()
                        .withShipping(DEFAULT_SHIPPING_FEE)
                        .withDiscount(DEFAULT_DISCOUNT)
                        .build()
                        .calculate(subtotal))
                .build();
    }

    @Override
    @Transactional
    public CheckoutSummaryResponse updateCheckoutPaymentMethod(UpdateCheckoutPaymentMethodRequest request) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new UnauthorizedException("Checkout session expired or order is invalid"));

        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        if (cartItems.isEmpty()) {
            throw new UnauthorizedException("Checkout session expired or order is invalid");
        }

        PaymentMethod selectedMethod = request != null ? request.getPaymentMethod() : null;
        if (selectedMethod == null) {
            throw new BadRequestException("Please select a payment method");
        }

        if (!CHECKOUT_PAYMENT_METHODS.contains(selectedMethod)) {
            throw new BadRequestException("Invalid payment method. Allowed values: COD, E-payment");
        }

        cart.setSelectedPaymentMethod(selectedMethod);
        cartRepository.save(cart);

        return getCheckoutSummary();
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request) {
        try {
            User user = getCurrentUser();
            Cart cart = cartRepository.findByUser(user)
                    .orElseThrow(() -> new BadRequestException("Cart is empty"));

            List<CartItem> cartItems = cartItemRepository.findByCart(cart);
            if (cartItems.isEmpty()) {
                throw new BadRequestException("Cart is empty");
            }

            PaymentMethod selectedPaymentMethod = resolvePlaceOrderPaymentMethod(request, cart);

            BigDecimal subtotal = ZERO;
            List<CartItem> validItems = new ArrayList<>();
            Map<Integer, Product> validatedProducts = new HashMap<>();

            for (CartItem cartItem : cartItems) {
                Product product = validateAndLockProduct(cartItem.getProduct().getId());
                validateProductAvailability(product, cartItem);

                BigDecimal lineTotal = product.getPrice()
                        .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
                subtotal = subtotal.add(lineTotal);
                validItems.add(cartItem);
                validatedProducts.put(product.getId(), product);
            }

            PriceCalculator priceCalculator = PriceCalculatorBuilder.base()
                    .withShipping(DEFAULT_SHIPPING_FEE)
                    .withDiscount(DEFAULT_DISCOUNT)
                    .build();
            BigDecimal finalTotal = priceCalculator.calculate(subtotal);

            Order order = orderRepository.save(Order.builder()
                    .user(user)
                    .status(selectedPaymentMethod == PaymentMethod.COD ? OrderStatus.CONFIRMED : OrderStatus.PENDING)
                    .totalPrice(finalTotal)
                    .receiverName(request.getReceiverName())
                    .phone(request.getPhone())
                    .shippingAddress(buildShippingAddress(request))
                    .customerNote(request.getNote())
                    .build());

            for (CartItem cartItem : validItems) {
                Product product = validatedProducts.get(cartItem.getProduct().getId());

                product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
                productRepository.save(product);

                orderItemRepository.save(OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(cartItem.getQuantity())
                        .price(product.getPrice())
                        .build());
            }

            paymentRepository.save(Payment.builder()
                    .order(order)
                    .paymentMethod(selectedPaymentMethod)
                    .paymentStatus(PaymentStatus.UNPAID)
                    .build());

            Invoice invoice = Invoice.builder()
                    .order(order)
                    .invoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .tax(ZERO)
                    .totalAmount(finalTotal)
                    .paymentStatus(PENDING)
                    .note("Invoice created automatically when placing order")
                    .build();
            invoiceRepository.save(invoice);

            cartItemRepository.deleteByCart(cart);
            cart.setSelectedPaymentMethod(null);
            cartRepository.save(cart);
            orderEventPublisher.publish(new OrderEvent(
                    OrderEventType.ORDER_PLACED,
                    order.getId(),
                    user.getId(),
                    "Order #" + order.getId() + " placed successfully"
            ));

            return OrderMapper.toResponse(
                    order,
                    orderItemRepository.findByOrder(order),
                    paymentRepository.findTopByOrderOrderByIdDesc(order)
            );
        } catch (BadRequestException | ResourceNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new OrderPlacementException("Order placement failed", ex);
        }
    }

    @Override
    public List<OrderResponse> getMyOrders() {
        User user = getCurrentUser();
        return orderRepository.findByUser(user).stream()
                .map(order -> OrderMapper.toResponse(
                        order,
                        orderItemRepository.findByOrder(order),
                        paymentRepository.findTopByOrderOrderByIdDesc(order)
                ))
                .toList();
    }

    @Override
    public PaginationResponse<OrderSummaryResponse> getMyOrderHistory(CustomerOrderHistoryQuery query) {
        User user = getCurrentUser();

        try {
            Pageable pageable = PageRequest.of(
                    query.getPage(),
                    query.getSize(),
                    resolveSort(query.getSortBy(), query.getSortDir())
            );

            Page<Order> orderPage = orderRepository.findAll(
                    buildCustomerOrderHistorySpecification(user, query),
                    pageable
            );

            List<OrderSummaryResponse> items = orderPage.getContent().stream()
                    .map(this::toOrderSummaryResponse)
                    .toList();

            return PaginationResponse.<OrderSummaryResponse>builder()
                    .items(items)
                    .page(orderPage.getNumber())
                    .size(orderPage.getSize())
                    .totalItems(orderPage.getTotalElements())
                    .totalPages(orderPage.getTotalPages())
                    .build();
        } catch (OrderListLoadException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new OrderListLoadException("Unable to load order history");
        }
    }

    @Override
    public OrderDetailResponse getMyOrderDetail(Integer orderId) {
        try {
            User user = getCurrentUser();
            Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
            return buildOrderDetailResponse(order);
        } catch (ResourceNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new OrderDetailLoadException(ex);
        }
    }

    @Override
    public OrderStatusTrackingResponse getMyOrderTrackingStatus(Integer orderId) {
        try {
            User user = getCurrentUser();
            Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

            return buildOrderStatusTrackingResponse(order);
        } catch (ResourceNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new OrderStatusLoadException(ex);
        }
    }

    @Override
    @Transactional
    public CancelOrderResponse cancelMyOrder(Integer orderId, CancelOrderRequest request) {
        try {
            User user = getCurrentUser();
            Order order = getOrderOrThrow(orderId);

            validateCustomerOwnsOrder(user, order);
            validateOrderCanBeCancelledByCustomer(order);

            if (order.getStatus() != OrderStatus.CANCELLED) {
                order.setStatus(OrderStatus.CANCELLED);
                order = orderRepository.save(order);
            }

            return CancelOrderResponse.builder()
                    .orderId(order.getId())
                    .status(order.getStatus())
                    .cancellationReason(request != null ? request.getReason() : null)
                    .updatedAt(order.getUpdatedAt())
                    .build();
        } catch (BadRequestException | ResourceNotFoundException | ForbiddenException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new OrderCancellationException();
        }
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> OrderMapper.toResponse(
                        order,
                        orderItemRepository.findByOrder(order),
                        paymentRepository.findTopByOrderOrderByIdDesc(order)
                ))
                .toList();
    }

    @Override
    public PaginationResponse<OrderSummaryResponse> getManageOrderSummaries(OrderListQuery query) {
        try {
            Sort sort = resolveSort(query.getSortBy(), query.getSortDir());
            PageRequest pageRequest = PageRequest.of(query.getPage(), query.getSize(), sort);
            Page<Order> orderPage = orderRepository.findAll(
                    buildManageOrderSpecification(query),
                    pageRequest
            );

            List<OrderSummaryResponse> items = orderPage.getContent().stream()
                    .map(this::toOrderSummaryResponse)
                    .toList();

            return PaginationResponse.<OrderSummaryResponse>builder()
                    .items(items)
                    .page(orderPage.getNumber())
                    .size(orderPage.getSize())
                    .totalItems(orderPage.getTotalElements())
                    .totalPages(orderPage.getTotalPages())
                    .build();
        } catch (OrderListLoadException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new OrderListLoadException("Failed to load order list");
        }
    }

    @Override
    public OrderDetailResponse getOrderDetail(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return buildOrderDetailResponse(order);
    }

    @Override
    @Transactional
    public UpdateOrderStatusResponse updateOrderStatus(Integer orderId, UpdateOrderStatusRequest request) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

            OrderStatus nextStatus = request.getStatus();
            OrderStatus currentStatus = order.getStatus();
            validateTransition(currentStatus, nextStatus);

            if (currentStatus != nextStatus) {
                order.setStatus(nextStatus);
                order.setManagedBy(getCurrentUser());
                order = orderRepository.save(order);
            }

            return UpdateOrderStatusResponse.builder()
                    .orderId(order.getId())
                    .previousStatus(currentStatus)
                    .currentStatus(order.getStatus())
                    .allowedNextStatuses(getAllowedNextStatuses(order.getStatus()))
                    .updatedAt(order.getUpdatedAt())
                    .updatedByUserId(order.getManagedBy() != null ? order.getManagedBy().getId() : null)
                    .build();
        } catch (BadRequestException | ResourceNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new OrderStatusUpdateException(ex);
        }
    }

    private OrderDetailResponse buildOrderDetailResponse(Order order) {
        try {
            return OrderMapper.toDetailResponse(
                    order,
                    orderItemRepository.findByOrder(order),
                    invoiceRepository.findByOrder(order),
                    paymentRepository.findTopByOrderOrderByIdDesc(order)
            );
        } catch (ResourceNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new OrderDetailLoadException(ex);
        }
    }

    private OrderStatusTrackingResponse buildOrderStatusTrackingResponse(Order order) {
        Invoice invoice = invoiceRepository.findByOrder(order).orElse(null);
        List<OrderItem> items = orderItemRepository.findByOrder(order);

        return OrderStatusTrackingResponse.builder()
                .summary(OrderSummaryResponse.builder()
                        .id(order.getId())
                        .orderId(order.getId())
                        .orderCode(invoice != null ? invoice.getInvoiceNumber() : "ORD-" + order.getId())
                        .orderDate(order.getCreatedAt())
                        .orderStatus(order.getStatus())
                        .totalAmount(order.getTotalPrice() != null ? order.getTotalPrice() : ZERO)
                        .itemCount(items.size())
                        .updatedAt(order.getUpdatedAt())
                        .build())
                .tracking(OrderTrackingMapper.toTrackingInfo(order))
                .build();
    }

    private CheckoutSummaryItemResponse toCheckoutItem(CartItem cartItem) {
        Product product = cartItem.getProduct();
        if (product == null) {
            throw new BadRequestException("Cart contains invalid product (product not found).");
        }
        BigDecimal unitPrice = product.getPrice() == null ? ZERO : product.getPrice();
        int quantity = cartItem.getQuantity() == null ? 0 : cartItem.getQuantity();

        return CheckoutSummaryItemResponse.builder()
                .itemId(cartItem.getId())
                .productId(product.getId())
                .productName(product.getName() != null ? product.getName() : "Unknown")
                .productImage(product.getImageUrl() != null ? product.getImageUrl() : "")
                .quantity(quantity)
                .unitPrice(unitPrice)
                .lineTotal(unitPrice.multiply(BigDecimal.valueOf(quantity)))
                .build();
    }

    private String buildShippingAddress(PlaceOrderRequest request) {
        List<String> chunks = new ArrayList<>();

        if (hasText(request.getShippingAddress())) {
            chunks.add(request.getShippingAddress().trim());
        }
        if (hasText(request.getDistrict())) {
            chunks.add(request.getDistrict().trim());
        }
        if (hasText(request.getCity())) {
            chunks.add(request.getCity().trim());
        }
        if (hasText(request.getProvince())) {
            chunks.add(request.getProvince().trim());
        }
        if (hasText(request.getPostalCode())) {
            chunks.add(request.getPostalCode().trim());
        }

        return String.join(", ", chunks);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private PaymentMethod resolveCheckoutPaymentMethod(Cart cart) {
        if (cart == null || cart.getSelectedPaymentMethod() == null) {
            return null;
        }

        return CHECKOUT_PAYMENT_METHODS.contains(cart.getSelectedPaymentMethod())
                ? cart.getSelectedPaymentMethod()
                : null;
    }

    private PaymentMethod resolvePlaceOrderPaymentMethod(PlaceOrderRequest request, Cart cart) {
        PaymentMethod selectedMethod = request.getPaymentMethod();

        if (selectedMethod == null) {
            selectedMethod = resolveCheckoutPaymentMethod(cart);
        }

        if (selectedMethod == null) {
            throw new BadRequestException("Please select a payment method");
        }

        if (!CHECKOUT_PAYMENT_METHODS.contains(selectedMethod)) {
            throw new BadRequestException("Invalid payment method. Allowed values: COD, E-payment");
        }

        return selectedMethod;
    }

    private Product validateAndLockProduct(Integer productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new BadRequestException("Product unavailable"));
    }

    private void validateProductAvailability(Product product, CartItem cartItem) {
        if (!Boolean.TRUE.equals(product.getIsActive())) {
            throw new BadRequestException("Product unavailable");
        }

        Integer availableStock = product.getStockQuantity();
        Integer requestedQty = cartItem.getQuantity();

        if (requestedQty == null || requestedQty <= 0) {
            throw new BadRequestException("Cart contains invalid item quantity");
        }

        if (availableStock == null || availableStock < requestedQty) {
            throw new BadRequestException("Insufficient stock available");
        }
    }

    private void validateTransition(OrderStatus current, OrderStatus next) {
        if (next == null) {
            throw new BadRequestException("Status is required");
        }
        // State Pattern: delegate transition validation to the current-state object
        if (!OrderStateFactory.of(current).canTransitionTo(next)) {
            throw new BadRequestException(
                    "Invalid status transition from " + current.getValue() + " to " + next.getValue()
            );
        }
    }

    private List<OrderStatus> getAllowedNextStatuses(OrderStatus currentStatus) {
        // State Pattern: ask the state object which transitions it permits
        return new ArrayList<>(OrderStateFactory.of(currentStatus).allowedTransitions());
    }

    private Sort resolveSort(String sortBy, String sortDir) {
        String normalizedSortBy = sortBy == null ? "createdAt" : sortBy;
        String safeSortBy = switch (normalizedSortBy) {
            case "id", "status", "totalPrice", "createdAt", "updatedAt" -> normalizedSortBy;
            default -> "createdAt";
        };

        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return Sort.by(direction, safeSortBy);
    }

    private Specification<Order> buildManageOrderSpecification(OrderListQuery query) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            var predicates = criteriaBuilder.conjunction();

            if (query.getStatus() != null) {
                predicates.getExpressions().add(
                        criteriaBuilder.equal(root.get("status"), query.getStatus())
                );
            }

            if (query.getKeyword() != null && !query.getKeyword().isBlank()) {
                String keyword = "%" + query.getKeyword().trim().toLowerCase(Locale.ROOT) + "%";
                predicates.getExpressions().add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("receiverName")), keyword),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), keyword),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("fullName")), keyword),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("email")), keyword)
                        )
                );
            }

            return predicates;
        };
    }

    private Specification<Order> buildCustomerOrderHistorySpecification(
            User user,
            CustomerOrderHistoryQuery query
    ) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            var predicates = criteriaBuilder.conjunction();

            predicates.getExpressions().add(
                    criteriaBuilder.equal(root.get("user").get("id"), user.getId())
            );

            if (query.getStatus() != null) {
                predicates.getExpressions().add(
                        criteriaBuilder.equal(root.get("status"), query.getStatus())
                );
            }

            return predicates;
        };
    }

    private OrderSummaryResponse toOrderSummaryResponse(Order order) {
        Invoice invoice = invoiceRepository.findByOrder(order).orElse(null);
        Payment payment = paymentRepository.findTopByOrderOrderByIdDesc(order).orElse(null);
        List<OrderItem> items = orderItemRepository.findByOrder(order);

        return OrderSummaryResponse.builder()
                .id(order.getId())
                .orderId(order.getId())
                .orderCode(invoice != null ? invoice.getInvoiceNumber() : "ORD-" + order.getId())
                .customerName(order.getUser() != null ? order.getUser().getFullName() : order.getReceiverName())
                .customerEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                .customerPhone(order.getPhone())
                .orderDate(order.getCreatedAt())
                .orderStatus(order.getStatus())
                .paymentStatus(payment != null ? payment.getPaymentStatus().name() : PaymentStatus.UNPAID.name())
                .paymentMethod(
                        payment != null && payment.getPaymentMethod() != null
                                ? payment.getPaymentMethod().name()
                                : null
                )
                .totalAmount(order.getTotalPrice() != null ? order.getTotalPrice() : ZERO)
                .itemCount(items.size())
                .shippingStatus(formatShippingStatus(order.getStatus()))
                .detailPath("/account/orders/" + order.getId())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private String formatShippingStatus(OrderStatus orderStatus) {
        if (orderStatus == null) {
            return "UNKNOWN";
        }

        return switch (orderStatus) {
            case PENDING, CONFIRMED, PROCESSING -> "PREPARING";
            case SHIPPED -> "IN_TRANSIT";
            case DELIVERED, COMPLETED -> "DELIVERED";
            case CANCELLED -> "CANCELLED";
        };
    }

    private Order getOrderOrThrow(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    private void validateCustomerOwnsOrder(User user, Order order) {
        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You are not allowed to cancel this order");
        }
    }

    private void validateOrderCanBeCancelledByCustomer(Order order) {
        if (order.getStatus() == null || CUSTOMER_NON_CANCELLABLE_STATUSES.contains(order.getStatus())) {
            throw new BadRequestException("Order cannot be cancelled");
        }
    }

    private User getCurrentUser() {
        String email = SecurityUtil.getCurrentUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }


}
