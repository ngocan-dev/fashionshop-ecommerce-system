# UC-34 – Track Order Status: Test Cases

---

## Test Case 34.1 — Track status of an active order (SHIPPED)

| Field | Value |
|---|---|
| **Test Case #** | 34.1 |
| **Test Case Name** | Track status of SHIPPED order |
| **System** | FashionShop |
| **Subsystem** | Order |
| **Designed by** | Group 18 |
| **Design Date** | 17/04/2026 |
| **Executed by** | Group 18 |
| **Execution Date** | 17/04/2026 |

**Short Description:** Customer tracks the real-time status of a currently SHIPPED order.

**Pre-conditions:**
- User is authenticated as CUSTOMER.
- An order with ID `42` exists for this user with current status `SHIPPED`.
- The order has progressed through: `PENDING → CONFIRMED → PROCESSING → SHIPPED`.

| Step | Action | Expected System Response | Pass/Fail | Comments |
|------|--------|--------------------------|-----------|----------|
| 1 | Send `GET /api/orders/my/42/status` | API returns `200 OK` with body: `{ summary: {...}, tracking: { currentStatus: "SHIPPED", progressSteps: [...], statusHistory: [...] } }` | Pass | |
| 2 | Verify `currentStatus` field | Response contains `currentStatus: "SHIPPED"`. | Pass | |
| 3 | Verify `progressSteps` | Steps list contains: PENDING ✓, CONFIRMED ✓, PROCESSING ✓, SHIPPED ✓ (active), DELIVERED (pending). | Pass | |
| 4 | Verify `statusHistory` | Each completed step has a `timestamp`. DELIVERED step has no timestamp yet. | Pass | |
| 5 | Verify `lastStatusUpdateAt` | Response contains a valid ISO-8601 datetime for the last SHIPPED transition. | Pass | |
| 6 | Verify `summary` object | Contains: `orderId`, `orderCode`, `totalAmount`, `paymentMethod`, `paymentStatus`. | Pass | |

**Post-Conditions:**
- Tracking data reflects the actual current state of the order.

---

## Test Case 34.2 — Track status of a DELIVERED order

| Field | Value |
|---|---|
| **Test Case #** | 34.2 |
| **Test Case Name** | Track status of completed DELIVERED order |
| **System** | FashionShop |
| **Subsystem** | Order |
| **Designed by** | Group 18 |
| **Design Date** | 17/04/2026 |
| **Executed by** | Group 18 |
| **Execution Date** | 17/04/2026 |

**Short Description:** Customer views tracking for a fully delivered order.

**Pre-conditions:**
- User is authenticated as CUSTOMER.
- Order `55` exists with status `DELIVERED` and full history of all 5 steps.

| Step | Action | Expected System Response | Pass/Fail | Comments |
|------|--------|--------------------------|-----------|----------|
| 1 | Send `GET /api/orders/my/55/status` | API returns `200 OK`. | Pass | |
| 2 | Verify all progress steps are complete | All steps (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED) show as completed with timestamps. | Pass | |
| 3 | Verify `currentStatus` | Returns `DELIVERED`. | Pass | |
| 4 | Verify no pending steps remain | All `progressSteps` entries are marked completed. | Pass | |

**Post-Conditions:**
- All steps are marked complete with accurate timestamps.

---

## Test Case 34.3 — Track status of a CANCELLED order

| Field | Value |
|---|---|
| **Test Case #** | 34.3 |
| **Test Case Name** | Track status of cancelled order |
| **System** | FashionShop |
| **Subsystem** | Order |
| **Designed by** | Group 18 |
| **Design Date** | 17/04/2026 |
| **Executed by** | Group 18 |
| **Execution Date** | 17/04/2026 |

**Short Description:** Customer views tracking for an order they cancelled.

**Pre-conditions:**
- User is authenticated as CUSTOMER.
- Order `60` was cancelled by the customer with reason "Changed my mind".

| Step | Action | Expected System Response | Pass/Fail | Comments |
|------|--------|--------------------------|-----------|----------|
| 1 | Send `GET /api/orders/my/60/status` | API returns `200 OK`. | Pass | |
| 2 | Verify `currentStatus` | Returns `CANCELLED`. | Pass | |
| 3 | Verify `cancellationNote` | Returns the reason: "Changed my mind". | Pass | |
| 4 | Verify progress steps reflect cancellation | Steps after cancellation point are marked as not applicable. | Pass | |

**Post-Conditions:**
- Cancellation reason and status are correctly returned.

---

## Test Case 34.4 — Track order that does not belong to current user

| Field | Value |
|---|---|
| **Test Case #** | 34.4 |
| **Test Case Name** | Access another user's order tracking |
| **System** | FashionShop |
| **Subsystem** | Order |
| **Designed by** | Group 18 |
| **Design Date** | 17/04/2026 |
| **Executed by** | Group 18 |
| **Execution Date** | 17/04/2026 |

**Short Description:** Customer attempts to track an order belonging to a different user.

**Pre-conditions:**
- User A is authenticated as CUSTOMER.
- Order `99` belongs to User B (different account).

| Step | Action | Expected System Response | Pass/Fail | Comments |
|------|--------|--------------------------|-----------|----------|
| 1 | Send `GET /api/orders/my/99/status` as User A | API returns `403 Forbidden` or `404 Not Found`. | Pass | Cannot access other users' orders. |
| 2 | Verify no order data is returned | Response body does not contain any order details for order 99. | Pass | |

**Post-Conditions:**
- Cross-user order data is not accessible.

---

## Test Case 34.5 — Track a non-existent order

| Field | Value |
|---|---|
| **Test Case #** | 34.5 |
| **Test Case Name** | Track non-existent order |
| **System** | FashionShop |
| **Subsystem** | Order |
| **Designed by** | Group 18 |
| **Design Date** | 17/04/2026 |
| **Executed by** | Group 18 |
| **Execution Date** | 17/04/2026 |

**Short Description:** Customer attempts to track an order ID that does not exist.

**Pre-conditions:**
- User is authenticated as CUSTOMER.
- Order ID `99999` does not exist in the database.

| Step | Action | Expected System Response | Pass/Fail | Comments |
|------|--------|--------------------------|-----------|----------|
| 1 | Send `GET /api/orders/my/99999/status` | API returns `404 Not Found` with appropriate error message. | Pass | |
| 2 | Verify error message | Response body contains a meaningful message such as "Order not found". | Pass | |

**Post-Conditions:**
- No order data returned. User receives a clear error response.

---

## Test Case 34.6 — Unauthenticated order tracking request

| Field | Value |
|---|---|
| **Test Case #** | 34.6 |
| **Test Case Name** | Unauthenticated tracking request |
| **System** | FashionShop |
| **Subsystem** | Order |
| **Designed by** | Group 18 |
| **Design Date** | 17/04/2026 |
| **Executed by** | Group 18 |
| **Execution Date** | 17/04/2026 |

**Short Description:** An unauthenticated user attempts to access order tracking.

**Pre-conditions:**
- No Authorization header is sent with the request.

| Step | Action | Expected System Response | Pass/Fail | Comments |
|------|--------|--------------------------|-----------|----------|
| 1 | Send `GET /api/orders/my/42/status` without JWT token | API returns `401 Unauthorized`. | Pass | |
| 2 | Verify response body | Error message returned; no order data exposed. | Pass | |

**Post-Conditions:**
- No order data is returned to unauthenticated callers.
