# Order Subsystem – Lab 7

**System:** FashionShop  
**Subsystem:** Order  
**Date:** 17/04/2026  
**Group:** 18

---

## 1. Overview

The **Order subsystem** manages the full lifecycle of a customer purchase: from checkout to delivery or cancellation. It integrates with Cart, Payment, Invoice, and Notification subsystems.

---

## 2. Entities

| Entity | Table | Description |
|---|---|---|
| `Order` | `orders` | Main order record tied to a customer user |
| `OrderItem` | `order_items` | Individual product line items within an order |

### `Order` Fields

| Field | Type | Notes |
|---|---|---|
| `id` | `Integer` | Primary key |
| `user` | `User` | Customer who placed the order |
| `status` | `OrderStatus` | Current lifecycle status |
| `totalPrice` | `BigDecimal` | Final calculated total |
| `receiverName` | `String` | Shipping recipient name |
| `phone` | `String` | Contact phone |
| `shippingAddress` | `String` | Delivery address |
| `customerNote` | `String` | Optional note from customer |
| `cancellationReason` | `String` | Populated on cancellation |
| `managedBy` | `User` | Staff/Admin who handled the order |
| `createdAt` | `LocalDateTime` | Immutable creation timestamp |
| `updatedAt` | `LocalDateTime` | Auto-updated on any change |

### `OrderItem` Fields

| Field | Type | Notes |
|---|---|---|
| `id` | `Integer` | Primary key |
| `order` | `Order` | Parent order |
| `product` | `Product` | Ordered product |
| `quantity` | `Integer` | Number of units |
| `price` | `BigDecimal` | Price snapshot at time of purchase |

---

## 3. Order Status Lifecycle

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → COMPLETED
                                                    ↓
                                               CANCELLED (from any state except COMPLETED)
```

| Status | Meaning |
|---|---|
| `PENDING` | Order just placed, awaiting confirmation |
| `CONFIRMED` | Staff confirmed the order |
| `PROCESSING` | Order being prepared/packed |
| `SHIPPED` | Order dispatched to carrier |
| `DELIVERED` | Order received by customer |
| `COMPLETED` | Order fully closed |
| `CANCELLED` | Order cancelled by customer or staff |

---

## 4. API Endpoints

| Method | URL | Role | Use Case |
|---|---|---|---|
| `GET` | `/api/orders/checkout-summary` | CUSTOMER | UC-30: View checkout summary |
| `POST` | `/api/orders` | CUSTOMER | UC-29: Place order |
| `PATCH` | `/api/orders/checkout/payment-method` | CUSTOMER | UC-29: Select payment method |
| `GET` | `/api/orders/my` | CUSTOMER | UC-33: View current orders |
| `GET` | `/api/orders/my/history` | CUSTOMER | UC-33: View paginated order history |
| `GET` | `/api/orders/my/{orderId}` | CUSTOMER | UC-32: View order details |
| `GET` | `/api/orders/my/{orderId}/status` | CUSTOMER | UC-34: Track order status |
| `GET` | `/api/orders/my/{orderId}/payment` | CUSTOMER | View payment status |
| `PATCH` | `/api/orders/my/{orderId}/cancel` | CUSTOMER | UC-31: Cancel order |
| `GET` | `/api/orders` | STAFF/ADMIN | Manage: Paginated order list |
| `GET` | `/api/orders/manage/{orderId}` | STAFF/ADMIN | Manage: Order detail |
| `PATCH` | `/api/orders/{orderId}/status` | STAFF/ADMIN | Manage: Update order status |

---

## 5. Design Patterns Used

| Pattern | Location | Purpose |
|---|---|---|
| **State** | `order/state/` | Each `OrderStatus` has a corresponding State class (e.g., `ShippedOrderState`) that controls valid transitions |
| **Observer** | `order/observer/` | `OrderEventPublisher` fires `OrderEvent`s; `LogOrderEventListener` and `NotificationOrderEventListener` subscribe |
| **Decorator** | `order/pricing/` | `PriceCalculator` uses decorators (`DiscountDecorator`, `ShippingFeeDecorator`) to build the final price |

---

## 6. Relationships to Other Subsystems

| Subsystem | Relationship |
|---|---|
| **Cart** | On `placeOrder`, cart items are converted to `OrderItem` records |
| **Payment** | Each order can have multiple `Payment` attempts (`@ManyToOne Order`) |
| **Invoice** | Each completed order generates one `Invoice` (`@OneToOne Order`) |
| **Notification** | `NotificationOrderEventListener` triggers emails on status changes |
| **User** | `Order.user` (customer) and `Order.managedBy` (staff handling it) |
| **Product** | `OrderItem.product` — price is snapshotted at time of order |

---

## 7. Security

- All `/api/orders/my/**` endpoints require role `CUSTOMER`.
- All `/api/orders/manage/**` and `/api/orders/{id}/status` require role `STAFF` or `ADMIN`.
- Service layer verifies that a customer only accesses their own orders (ownership check before returning data).
