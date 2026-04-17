package com.example.fashionshop.modules.payment.service;

import com.example.fashionshop.common.enums.InvoicePaymentStatus;
import com.example.fashionshop.common.enums.OrderStatus;
import com.example.fashionshop.common.enums.PaymentMethod;
import com.example.fashionshop.common.enums.PaymentStatus;
import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.PaymentCancelledException;
import com.example.fashionshop.common.exception.PaymentGatewayException;
import com.example.fashionshop.modules.invoice.entity.Invoice;
import com.example.fashionshop.modules.invoice.repository.InvoiceRepository;
import com.example.fashionshop.modules.order.entity.Order;
import com.example.fashionshop.modules.order.repository.OrderRepository;
import com.example.fashionshop.modules.payment.dto.PaymentRequest;
import com.example.fashionshop.modules.payment.dto.PaymentResponse;
import com.example.fashionshop.modules.payment.entity.Payment;
import com.example.fashionshop.modules.payment.gateway.GatewayPaymentRequest;
import com.example.fashionshop.modules.payment.gateway.GatewayPaymentResult;
import com.example.fashionshop.modules.payment.gateway.GatewayPaymentStatus;
import com.example.fashionshop.modules.payment.gateway.PaymentGateway;
import com.example.fashionshop.modules.payment.gateway.PaymentGatewayFactory;
import com.example.fashionshop.modules.payment.repository.PaymentRepository;
import com.example.fashionshop.modules.user.entity.User;
import com.example.fashionshop.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private InvoiceRepository invoiceRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PaymentGatewayFactory paymentGatewayFactory;
    @Mock
    private PaymentGateway paymentGateway;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("customer@example.com", "password")
        );
    }

    @Test
    void processPayment_shouldMarkOrderAsConfirmedForCod() {
        User user = user();
        Order order = order(user);
        Invoice invoice = invoice(order);
        PaymentRequest request = new PaymentRequest();
        request.setPaymentMethod(PaymentMethod.COD);

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));
        when(paymentRepository.existsByOrderAndPaymentStatusIn(order, List.of(PaymentStatus.PAID))).thenReturn(false);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> {
            Payment payment = inv.getArgument(0);
            payment.setId(10);
            return payment;
        });
        when(invoiceRepository.findByOrder(order)).thenReturn(Optional.of(invoice));

        PaymentResponse response = paymentService.processPayment(order.getId(), request);

        assertThat(response.getPaymentStatus()).isEqualTo(PaymentStatus.PENDING);
        assertThat(response.getOrderStatus()).isEqualTo(OrderStatus.CONFIRMED);
        assertThat(response.getMessage()).isEqualTo("Order confirmed with cash on delivery");
        verify(orderRepository).save(order);
        verify(invoiceRepository).save(invoice);
        assertThat(invoice.getPaymentStatus()).isEqualTo(InvoicePaymentStatus.PENDING);
        assertThat(order.getStatus()).isEqualTo(OrderStatus.CONFIRMED);
    }

    @Test
    void processPayment_shouldThrowWhenGatewayFails() {
        User user = user();
        Order order = order(user);
        Invoice invoice = invoice(order);
        PaymentRequest request = cardRequest();

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));
        when(paymentRepository.existsByOrderAndPaymentStatusIn(order, List.of(PaymentStatus.PAID))).thenReturn(false);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));
        when(paymentGatewayFactory.getGateway(PaymentMethod.BANKING)).thenReturn(paymentGateway);
        when(paymentGateway.charge(any(GatewayPaymentRequest.class))).thenReturn(GatewayPaymentResult.builder()
                .status(GatewayPaymentStatus.FAILED)
                .message("Payment failed")
                .build());
        when(invoiceRepository.findByOrder(order)).thenReturn(Optional.of(invoice));

        assertThatThrownBy(() -> paymentService.processPayment(order.getId(), request))
                .isInstanceOf(PaymentGatewayException.class)
                .hasMessage("Payment failed");

        assertThat(invoice.getPaymentStatus()).isEqualTo(InvoicePaymentStatus.FAILED);
        verify(orderRepository, never()).save(order);
    }

    @Test
    void processPayment_shouldThrowWhenGatewayCancelled() {
        User user = user();
        Order order = order(user);
        Invoice invoice = invoice(order);
        PaymentRequest request = cardRequest();

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));
        when(paymentRepository.existsByOrderAndPaymentStatusIn(order, List.of(PaymentStatus.PAID))).thenReturn(false);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));
        when(paymentGatewayFactory.getGateway(PaymentMethod.BANKING)).thenReturn(paymentGateway);
        when(paymentGateway.charge(any(GatewayPaymentRequest.class))).thenReturn(GatewayPaymentResult.builder()
                .status(GatewayPaymentStatus.CANCELLED)
                .message("Payment cancelled")
                .build());
        when(invoiceRepository.findByOrder(order)).thenReturn(Optional.of(invoice));

        assertThatThrownBy(() -> paymentService.processPayment(order.getId(), request))
                .isInstanceOf(PaymentCancelledException.class);

        assertThat(invoice.getPaymentStatus()).isEqualTo(InvoicePaymentStatus.PENDING);
        verify(orderRepository, never()).save(order);
    }

    @Test
    void processPayment_shouldReturnExistingPaymentForSameIdempotencyKey() {
        User user = user();
        Order order = order(user);
        PaymentRequest request = cardRequest();
        request.setIdempotencyKey("idem-abc");
        Payment existing = Payment.builder()
                .id(20)
                .order(order)
                .paymentMethod(PaymentMethod.BANKING)
                .paymentStatus(PaymentStatus.PAID)
                .idempotencyKey("idem-abc")
                .paidAt(LocalDateTime.now())
                .build();

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));
        when(paymentRepository.existsByOrderAndPaymentStatusIn(order, List.of(PaymentStatus.PAID))).thenReturn(false);
        when(paymentRepository.findTopByOrderAndIdempotencyKeyOrderByIdDesc(order, "idem-abc"))
                .thenReturn(Optional.of(existing));

        PaymentResponse response = paymentService.processPayment(order.getId(), request);

        assertThat(response.getPaymentId()).isEqualTo(20);
        verify(paymentRepository, never()).save(any(Payment.class));
        verify(paymentGateway, never()).charge(any());
    }

    @Test
    void processPayment_shouldRejectExpiredOrder() {
        User user = user();
        Order order = order(user);
        order.setCreatedAt(LocalDateTime.now().minusMinutes(31));
        PaymentRequest request = new PaymentRequest();
        request.setPaymentMethod(PaymentMethod.COD);

        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> paymentService.processPayment(order.getId(), request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Checkout session has expired");
    }

    private User user() {
        User user = new User();
        user.setId(3);
        user.setEmail("customer@example.com");
        return user;
    }

    private Order order(User user) {
        Order order = new Order();
        order.setId(1001);
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalPrice(new BigDecimal("250.00"));
        order.setCreatedAt(LocalDateTime.now());
        return order;
    }

    private Invoice invoice(Order order) {
        Invoice invoice = new Invoice();
        invoice.setOrder(order);
        invoice.setPaymentStatus(InvoicePaymentStatus.PENDING);
        return invoice;
    }

    private PaymentRequest cardRequest() {
        PaymentRequest request = new PaymentRequest();
        request.setPaymentMethod(PaymentMethod.BANKING);
        request.setCardHolderName("Jane Customer");
        request.setCardNumber("4111111111111111");
        request.setExpiryMonth("12");
        request.setExpiryYear("29");
        request.setCvv("123");
        request.setIdempotencyKey("idem-123");
        return request;
    }
}
