package com.example.fashionshop.modules.invoice.repository;

import com.example.fashionshop.modules.invoice.entity.Invoice;
import com.example.fashionshop.modules.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer>, JpaSpecificationExecutor<Invoice> {
    Optional<Invoice> findByOrder(Order order);
}
