# UC-33 – View Order History: Test Cases

---

## Test Case 33.1 — View all orders (default)

| Field | Value |
|---|---|
| **Test Case #** | 33.1 |
| **Test Case Name** | View all order history |
| **System** | FashionShop |
| **Subsystem** | Order |
| **Designed by** | Group 18 |
| **Design Date** | 17/04/2026 |
| **Executed by** | Group 18 |
| **Execution Date** | 17/04/2026 |

**Short Description:** Customer views their full order history list at `/orders`.

**Pre-conditions:**
- User is authenticated as CUSTOMER.
- At least 3 orders exist for this user with statuses: `PENDING`, `SHIPPED`, `DELIVERED`.
- System is displaying the Orders page (`/orders`).

| Step | Action | Expected System Response | Pass/Fail | Comments |
|------|--------|--------------------------|-----------|----------|
| 1 | Navigate to `/orders` | Page loads; `GET /api/orders/my` is called. System displays all orders in a table with columns: Reference, Status, Placed, Total, Action. | Pass | |
| 2 | Verify order count | All 3 orders are listed. Each row shows order number (#id), status badge, date placed, and total price. | Pass | |
| 3 | Verify status badges are present | Each order shows its status label (e.g., PENDING, SHIPPED, DELIVERED) styled in uppercase. | Pass | |
| 4 | Click "View Details" on any order | System navigates to `/orders/{orderId}`. | Pass | |

**Post-Conditions:**
- All orders belonging to the logged-in user are displayed.
- No other users' orders are visible.

---

## Test Case 33.2 — Filter order history by status

| Field | Value |
|---|---|
| **Test Case #** | 33.2 |
| **Test Case Name** | Filter order history by status |
| **System** | FashionShop |
| **Subsystem** | Order |
| **Designed by** | Group 18 |
| **Design Date** | 17/04/2026 |
| **Executed by** | Group 18 |
| **Execution Date** | 17/04/2026 |

**Short Description:** Customer filters the order history list by a specific status.

**Pre-conditions:**
- Same as 33.1.
- User is on the Orders page with the default "ALL" filter active.

| Step | Action | Expected System Response | Pass/Fail | Comments |
|------|--------|--------------------------|-----------|----------|
| 1 | Click filter button "PENDING" | List updates to show only orders with status `PENDING`. Other orders are hidden. | Pass | |
| 2 | Click filter button "SHIPPED" | List updates to show only orders with status `SHIPPED`. | Pass | |
| 3 | Click filter button "DELIVERED" | List updates to show only orders with status `DELIVERED`. | Pass | |
| 4 | Click filter button "ALL" | All orders are displayed again regardless of status. | Pass | |
| 5 | Click "SHIPPED" when no shipped orders exist | System displays message: "No shipped orders found." | Pass | |

**Post-Conditions:**
- The filter state is reflected in the UI (active button is highlighted).
- No additional API calls are made on filter change (filtering is client-side).

---

## Test Case 33.3 — View order history when no orders exist

| Field | Value |
|---|---|
| **Test Case #** | 33.3 |
| **Test Case Name** | Empty order history |
| **System** | FashionShop |
| **Subsystem** | Order |
| **Designed by** | Group 18 |
| **Design Date** | 17/04/2026 |
| **Executed by** | Group 18 |
| **Execution Date** | 17/04/2026 |

**Short Description:** Customer with no orders views the Orders page.

**Pre-conditions:**
- User is authenticated as CUSTOMER.
- No orders exist for this user.

| Step | Action | Expected System Response | Pass/Fail | Comments |
|------|--------|--------------------------|-----------|----------|
| 1 | Navigate to `/orders` | System calls `GET /api/orders/my`. API returns empty list `[]`. | Pass | |
| 2 | View page content | System displays empty state with title "No orders yet" and description "Your order history will appear here." | Pass | |
| 3 | Click "Browse products" link | System navigates to `/products`. | Pass | |

**Post-Conditions:**
- Empty state is shown without error.

---

## Test Case 33.4 — Unauthenticated access to order history

| Field | Value |
|---|---|
| **Test Case #** | 33.4 |
| **Test Case Name** | Unauthorized order history access |
| **System** | FashionShop |
| **Subsystem** | Order |
| **Designed by** | Group 18 |
| **Design Date** | 17/04/2026 |
| **Executed by** | Group 18 |
| **Execution Date** | 17/04/2026 |

**Short Description:** A user who is not logged in attempts to access order history.

**Pre-conditions:**
- User is NOT authenticated (no valid JWT token).

| Step | Action | Expected System Response | Pass/Fail | Comments |
|------|--------|--------------------------|-----------|----------|
| 1 | Send `GET /api/orders/my` without Authorization header | API returns `401 Unauthorized`. | Pass | |
| 2 | Navigate to `/orders` in browser | Middleware redirects user to `/login` page. | Pass | |

**Post-Conditions:**
- No order data is returned to unauthenticated users.
