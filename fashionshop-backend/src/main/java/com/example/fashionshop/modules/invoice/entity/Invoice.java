package com.example.fashionshop.modules.invoice.entity;

import com.example.fashionshop.common.enums.InvoicePaymentStatus;
import com.example.fashionshop.modules.order.entity.Order;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @Column(precision = 10, scale = 2)
    private BigDecimal tax;

    @Column(name = "issued_at", updatable = false)
    private LocalDateTime issuedAt;

    @Lob
    private String note;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private InvoicePaymentStatus paymentStatus;

    @PrePersist
    public void prePersist() {
        if (issuedAt == null) {
            issuedAt = LocalDateTime.now();
        }
        if (tax == null) {
            tax = BigDecimal.ZERO;
        }
        if (totalAmount == null) {
            totalAmount = BigDecimal.ZERO;
        }
        if (paymentStatus == null) {
            paymentStatus = InvoicePaymentStatus.PENDING;
        }
    }
}
