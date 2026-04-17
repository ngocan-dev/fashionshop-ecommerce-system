package com.example.fashionshop.modules.invoice.service;

import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.ForbiddenException;
import com.example.fashionshop.common.exception.InvoiceDetailLoadException;
import com.example.fashionshop.common.exception.InvoiceListLoadException;
import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.common.mapper.InvoiceMapper;
import com.example.fashionshop.common.response.PaginationResponse;
import com.example.fashionshop.common.util.SecurityUtil;
import com.example.fashionshop.modules.invoice.dto.InvoiceDetailResponse;
import com.example.fashionshop.modules.invoice.dto.InvoiceListQuery;
import com.example.fashionshop.modules.invoice.dto.InvoiceResponse;
import com.example.fashionshop.modules.invoice.dto.InvoiceSummaryResponse;
import com.example.fashionshop.modules.invoice.entity.Invoice;
import com.example.fashionshop.modules.invoice.repository.InvoiceRepository;
import com.example.fashionshop.modules.order.entity.Order;
import com.example.fashionshop.modules.order.entity.OrderItem;
import com.example.fashionshop.modules.order.repository.OrderItemRepository;
import com.example.fashionshop.modules.order.repository.OrderRepository;
import com.example.fashionshop.modules.payment.entity.Payment;
import com.example.fashionshop.modules.payment.repository.PaymentRepository;
import com.example.fashionshop.modules.user.entity.User;
import com.example.fashionshop.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public InvoiceResponse getByOrderId(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        ensureAccess(order);

        Invoice invoice = invoiceRepository.findByOrder(order)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
        return InvoiceMapper.toResponse(invoice);
    }

    @Override
    public InvoiceResponse getById(Integer invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
        ensureAccess(invoice.getOrder());
        return InvoiceMapper.toResponse(invoice);
    }

    @Override
    public InvoiceDetailResponse getMyInvoiceDetail(Integer invoiceId) {
        try {
            Invoice invoice = invoiceRepository.findById(invoiceId)
                    .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
            ensureAccess(invoice.getOrder());
            return buildInvoiceDetail(invoice);
        } catch (ResourceNotFoundException | ForbiddenException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new InvoiceDetailLoadException(ex);
        }
    }

    @Override
    public PaginationResponse<InvoiceSummaryResponse> getManageInvoices(InvoiceListQuery query) {
        try {
            PageRequest pageRequest = PageRequest.of(query.getPage(), query.getSize(), resolveSort(query.getSortBy(), query.getSortDir()));
            Page<Invoice> invoicePage = invoiceRepository.findAll(buildManageInvoiceSpecification(query), pageRequest);

            List<InvoiceSummaryResponse> items = invoicePage.getContent().stream()
                    .map(this::toSummary)
                    .toList();

            return PaginationResponse.<InvoiceSummaryResponse>builder()
                    .items(items)
                    .page(invoicePage.getNumber())
                    .size(invoicePage.getSize())
                    .totalItems(invoicePage.getTotalElements())
                    .totalPages(invoicePage.getTotalPages())
                    .build();
        } catch (InvoiceListLoadException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new InvoiceListLoadException("Unable to load invoices");
        }
    }

    @Override
    public InvoiceDetailResponse getManageInvoiceDetail(Integer invoiceId) {
        try {
            Invoice invoice = invoiceRepository.findById(invoiceId)
                    .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
            return buildInvoiceDetail(invoice);
        } catch (ResourceNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new InvoiceDetailLoadException(ex);
        }
    }

    private void ensureAccess(Order order) {
        User user = getCurrentUser();
        if (order == null || order.getUser() == null) {
            throw new BadRequestException("Invoice is not linked to a customer order");
        }
        if (user.getRole().name().equals("CUSTOMER") && !order.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You are not allowed to view this invoice");
        }
    }

    private InvoiceDetailResponse buildInvoiceDetail(Invoice invoice) {
        Order order = invoice.getOrder();
        Payment payment = paymentRepository.findTopByOrderOrderByIdDesc(order).orElse(null);
        List<OrderItem> items = orderItemRepository.findByOrder(order);

        BigDecimal subtotal = calculateSubtotal(items);
        BigDecimal totalAmount = defaultMoney(invoice.getTotalAmount());
        BigDecimal taxAmount = defaultMoney(invoice.getTax());
        BigDecimal shippingFee = BigDecimal.ZERO;
        BigDecimal discountAmount = subtotal.add(shippingFee).add(taxAmount).subtract(totalAmount);
        if (discountAmount.signum() < 0) {
            discountAmount = BigDecimal.ZERO;
        }

        return InvoiceDetailResponse.builder()
                .summary(InvoiceDetailResponse.InvoiceSummary.builder()
                        .invoiceId(invoice.getId())
                        .invoiceNumber(invoice.getInvoiceNumber())
                        .orderId(order != null ? order.getId() : null)
                        .orderNumber(resolveOrderNumber(order, invoice))
                        .invoiceDate(invoice.getIssuedAt())
                        .paymentStatus(invoice.getPaymentStatus())
                        .paymentMethod(payment != null ? payment.getPaymentMethod() : null)
                        .totalAmount(totalAmount)
                        .subtotal(subtotal)
                        .shippingFee(shippingFee)
                        .discountAmount(discountAmount)
                        .taxAmount(taxAmount)
                        .build())
                .customer(InvoiceDetailResponse.CustomerInfo.builder()
                        .fullName(resolveCustomerName(order))
                        .email(order != null && order.getUser() != null ? order.getUser().getEmail() : null)
                        .phone(order != null ? order.getPhone() : null)
                        .billingAddress(order != null ? order.getShippingAddress() : null)
                        .shippingAddress(order != null ? order.getShippingAddress() : null)
                        .build())
                .items(items.stream().map(this::toDetailItem).toList())
                .additional(InvoiceDetailResponse.AdditionalInfo.builder()
                        .transactionReference(payment != null ? payment.getTransactionReference() : null)
                        .notes(invoice.getNote())
                        .createdAt(invoice.getIssuedAt())
                        .updatedAt(resolveUpdatedAt(order, payment))
                        .build())
                .build();
    }

    private User getCurrentUser() {
        String email = SecurityUtil.getCurrentUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    private Sort resolveSort(String sortBy, String sortDir) {
        String normalizedSortBy = sortBy == null ? "issuedAt" : sortBy;
        String safeSortBy = switch (normalizedSortBy) {
            case "id", "invoiceNumber", "totalAmount", "paymentStatus", "issuedAt" -> normalizedSortBy;
            default -> "issuedAt";
        };
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(direction, safeSortBy);
    }

    private Specification<Invoice> buildManageInvoiceSpecification(InvoiceListQuery query) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            var predicates = criteriaBuilder.conjunction();

            if (query.getPaymentStatus() != null) {
                predicates.getExpressions().add(criteriaBuilder.equal(root.get("paymentStatus"), query.getPaymentStatus()));
            }

            if (query.getKeyword() != null && !query.getKeyword().isBlank()) {
                String keyword = "%" + query.getKeyword().trim().toLowerCase(Locale.ROOT) + "%";
                predicates.getExpressions().add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("invoiceNumber")), keyword),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("order").get("user").get("fullName")), keyword),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("order").get("user").get("email")), keyword),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("order").get("phone")), keyword)
                        )
                );
            }
            return predicates;
        };
    }

    private InvoiceSummaryResponse toSummary(Invoice invoice) {
        Order order = invoice.getOrder();
        Payment payment = paymentRepository.findTopByOrderOrderByIdDesc(order).orElse(null);

        return InvoiceSummaryResponse.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .orderId(order != null ? order.getId() : null)
                .invoiceDate(invoice.getIssuedAt())
                .customerName(resolveCustomerName(order))
                .customerEmail(order != null && order.getUser() != null ? order.getUser().getEmail() : null)
                .customerPhone(order != null ? order.getPhone() : null)
                .totalAmount(defaultMoney(invoice.getTotalAmount()))
                .paymentStatus(invoice.getPaymentStatus())
                .paymentMethod(payment != null ? payment.getPaymentMethod() : null)
                .invoiceStatus(resolveInvoiceStatus(invoice))
                .detailPath("/account/invoices/" + invoice.getId())
                .dueDate(null)
                .updatedAt(order != null ? order.getUpdatedAt() : null)
                .build();
    }

    private InvoiceDetailResponse.InvoiceItem toDetailItem(OrderItem item) {
        BigDecimal unitPrice = defaultMoney(item.getPrice());
        Integer quantity = item.getQuantity() != null ? item.getQuantity() : 0;
        return InvoiceDetailResponse.InvoiceItem.builder()
                .productImageUrl(item.getProduct() != null ? item.getProduct().getImageUrl() : null)
                .productName(item.getProduct() != null ? item.getProduct().getName() : "Unknown product")
                .sku(item.getProduct() != null && item.getProduct().getId() != null ? "PRD-" + item.getProduct().getId() : null)
                .quantity(quantity)
                .unitPrice(unitPrice)
                .lineTotal(unitPrice.multiply(BigDecimal.valueOf(quantity)))
                .variant(null)
                .build();
    }

    private String resolveCustomerName(Order order) {
        if (order == null) {
            return "Unknown customer";
        }
        if (order.getUser() != null && order.getUser().getFullName() != null && !order.getUser().getFullName().isBlank()) {
            return order.getUser().getFullName();
        }
        if (order.getReceiverName() != null && !order.getReceiverName().isBlank()) {
            return order.getReceiverName();
        }
        return "Unknown customer";
    }

    private String resolveOrderNumber(Order order, Invoice invoice) {
        if (order == null) {
            return invoice != null ? invoice.getInvoiceNumber() : null;
        }
        return "ORD-" + order.getId();
    }

    private LocalDateTime resolveUpdatedAt(Order order, Payment payment) {
        LocalDateTime orderUpdatedAt = order != null ? order.getUpdatedAt() : null;
        LocalDateTime paymentUpdatedAt = payment != null ? payment.getUpdatedAt() : null;
        if (orderUpdatedAt == null) {
            return paymentUpdatedAt;
        }
        if (paymentUpdatedAt == null) {
            return orderUpdatedAt;
        }
        return orderUpdatedAt.isAfter(paymentUpdatedAt) ? orderUpdatedAt : paymentUpdatedAt;
    }

    private String resolveInvoiceStatus(Invoice invoice) {
        if (invoice == null || invoice.getPaymentStatus() == null) {
            return "UNKNOWN";
        }
        return switch (invoice.getPaymentStatus()) {
            case PAID -> "SETTLED";
            case FAILED -> "FAILED";
            case REFUNDED -> "REFUNDED";
            case PENDING -> "ISSUED";
        };
    }

    private BigDecimal calculateSubtotal(List<OrderItem> items) {
        return items.stream()
                .map(item -> defaultMoney(item.getPrice()).multiply(BigDecimal.valueOf(item.getQuantity() != null ? item.getQuantity() : 0L)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal defaultMoney(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
