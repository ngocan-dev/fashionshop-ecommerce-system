# Endpoint Mapping

This document maps backend endpoints to frontend service, hook, and screen.

## Authentication

| Endpoint | Service | Hook | Screen | Role |
|---|---|---|---|---|
| POST /api/auth/register | features/auth/services.register | features/auth/hooks.useRegisterMutation | app/(public)/register/page.tsx | GUEST |
| POST /api/auth/login | features/auth/services.login | features/auth/hooks.useLoginMutation | app/(public)/login/page.tsx | GUEST |
| POST /api/auth/logout | features/auth/services.logout | features/auth/hooks.useLogoutMutation | layout role shells | CUSTOMER STAFF ADMIN |

## User and Account

| Endpoint | Service | Hook | Screen | Role |
|---|---|---|---|---|
| GET /api/users/profile | features/users/services.fetchUserProfile | features/users/hooks.useUserProfileQuery | app/(customer)/account/page.tsx | CUSTOMER |
| PUT /api/users/profile | features/users/services.updateUserProfile | features/users/hooks.useUpdateProfileMutation | app/(customer)/account/edit/page.tsx | CUSTOMER |
| GET /api/users/me | features/users/services.fetchMeUser | features/users/hooks.useMeUserQuery | app/(customer)/account/page.tsx | CUSTOMER |
| GET /api/me | features/users/services.fetchMe and features/auth/services.fetchMe | features/users/hooks.useMeQuery and features/auth/hooks.useMeQuery | app/(customer)/account/page.tsx | CUSTOMER STAFF ADMIN |
| PUT /api/me | features/users/services.updateMe | features/users/hooks.useUpdateMeMutation | app/(customer)/account/edit/page.tsx | CUSTOMER |
| GET /api/me/orders | features/users/services.fetchMyOrders | features/users/hooks.useMyOrdersQuery | app/(customer)/orders/page.tsx | CUSTOMER |
| POST /api/admin/users/staff | features/users/services.createStaffAccount | features/users/hooks.useCreateStaffAccountMutation | app/(admin)/staff-accounts/new/page.tsx | ADMIN |
| GET /api/admin/users/staff | features/users/services.fetchStaffAccounts | features/users/hooks.useStaffAccountsQuery | app/(admin)/staff-accounts/page.tsx | ADMIN |
| GET /api/admin/users/customers | features/users/services.fetchCustomerAccounts | features/users/hooks.useCustomerAccountsQuery | app/(admin)/customers/page.tsx | ADMIN |
| DELETE /api/admin/users/{userId} | features/users/services.deleteAdminUser | features/users/hooks.useDeleteAdminUserMutation | app/(admin)/customers/page.tsx | ADMIN |
| GET /api/admin/staff-accounts | features/users/services.fetchAdminStaffAccounts | features/users/hooks.useAdminStaffAccountsQuery | app/(admin)/staff-accounts/page.tsx | ADMIN |
| GET /api/admin/customer-accounts | features/users/services.fetchAdminCustomerAccounts | features/users/hooks.useAdminCustomerAccountsQuery | app/(admin)/customers/page.tsx | ADMIN |
| DELETE /api/admin/accounts/{id} | features/users/services.deleteAdminAccount | features/users/hooks.useDeleteAdminAccountMutation | app/(admin)/staff-accounts/page.tsx | ADMIN |
| DELETE /api/admin/accounts/by-email?email= | features/users/services.deleteAdminAccountByEmail | features/users/hooks.useDeleteAdminAccountByEmailMutation | app/(admin)/customers/page.tsx | ADMIN |

## Catalog

| Endpoint | Service | Hook | Screen | Role |
|---|---|---|---|---|
| GET /api/categories | features/categories/services.fetchCategories | features/categories/hooks.useCategoriesQuery | app/(staff)/categories/page.tsx | STAFF ADMIN |
| POST /api/categories | features/categories/services.createCategory | features/categories/hooks.useCreateCategoryMutation | app/(staff)/categories/page.tsx | STAFF ADMIN |
| GET /api/products | features/products/services.fetchProducts | features/products/hooks.useProductsQuery | app/(staff)/products/page.tsx | STAFF ADMIN |
| GET /api/products/{id} | features/products/services.fetchProduct | features/products/hooks.useProductQuery | app/(staff)/products/[id]/edit/page.tsx | STAFF ADMIN |
| GET /api/products/search?keyword= | features/products/services.searchProducts | features/products/hooks.useProductSearchQuery | app/(public)/products/page.tsx | GUEST |
| POST /api/products | features/products/services.createProduct | features/products/hooks.useCreateProductMutation | app/(staff)/products/new/page.tsx | STAFF ADMIN |
| PUT /api/products/{id} | features/products/services.updateProduct | features/products/hooks.useUpdateProductMutation | app/(staff)/products/[id]/edit/page.tsx | STAFF ADMIN |
| DELETE /api/products/{id} | features/products/services.deleteProduct | features/products/hooks.useDeleteProductMutation | app/(staff)/products/page.tsx | STAFF ADMIN |
| GET /api/products/manage | features/products/services.fetchManageProducts | features/products/hooks.useManageProductsQuery | app/(staff)/products/page.tsx | STAFF ADMIN |
| GET /api/products/manage/{id} | features/products/services.fetchManageProduct | features/products/hooks.useManageProductQuery | app/(staff)/products/[id]/edit/page.tsx | STAFF ADMIN |
| PUT /api/products/manage/{id} | features/products/services.updateManageProduct | features/products/hooks.useUpdateManageProductMutation | app/(staff)/products/[id]/edit/page.tsx | STAFF ADMIN |
| DELETE /api/products/manage/{id} | features/products/services.deleteManageProduct | features/products/hooks.useDeleteManageProductMutation | app/(staff)/products/page.tsx | STAFF ADMIN |
| GET /api/store/products | features/products/services.fetchStoreProducts | features/products/hooks.useStoreProductsQuery | app/(public)/products/page.tsx | GUEST |
| GET /api/store/products/{idOrSlug} | features/products/services.fetchStoreProduct | features/products/hooks.useStoreProductQuery | app/(public)/products/[slug]/page.tsx | GUEST |

## Cart and Wishlist

| Endpoint | Service | Hook | Screen | Role |
|---|---|---|---|---|
| GET /api/cart | features/cart/services.fetchCart | features/cart/hooks.useCartQuery | app/(customer)/cart/page.tsx | CUSTOMER |
| GET /api/cart/summary | features/cart/services.fetchCartSummary | features/cart/hooks.useCartSummaryQuery | app/(customer)/checkout/page.tsx | CUSTOMER |
| POST /api/cart/items | features/cart/services.addCartItem | features/cart/hooks.useAddCartItemMutation | app/(public)/products/[slug]/page.tsx | CUSTOMER |
| PUT /api/cart/items/{itemId} | features/cart/services.updateCartItem | features/cart/hooks.useUpdateCartItemMutation | app/(customer)/cart/page.tsx | CUSTOMER |
| PUT /api/cart/items/{itemId}/quantity | features/cart/services.updateCartItemQuantity | features/cart/hooks.useUpdateCartItemQuantityMutation | app/(customer)/cart/page.tsx | CUSTOMER |
| DELETE /api/cart/items/{itemId} | features/cart/services.deleteCartItem | features/cart/hooks.useDeleteCartItemMutation | app/(customer)/cart/page.tsx | CUSTOMER |
| GET /api/wishlist | features/wishlist/services.fetchWishlist | features/wishlist/hooks.useWishlistQuery | app/(customer)/wishlist/page.tsx | CUSTOMER |
| GET /api/wishlist/items/contains/{productId} | features/wishlist/services.checkWishlistContains | features/wishlist/hooks.useWishlistContainsQuery | app/(public)/products/[slug]/page.tsx | CUSTOMER |
| POST /api/wishlist/items | features/wishlist/services.addWishlistItem | features/wishlist/hooks.useAddWishlistItemMutation | app/(public)/products/[slug]/page.tsx | CUSTOMER |
| DELETE /api/wishlist/items/{productId} | features/wishlist/services.deleteWishlistItem | features/wishlist/hooks.useDeleteWishlistItemMutation | app/(customer)/wishlist/page.tsx | CUSTOMER |

## Orders Payments Invoices

| Endpoint | Service | Hook | Screen | Role |
|---|---|---|---|---|
| GET /api/orders/checkout-summary | features/orders/services.fetchCheckoutSummary | features/orders/hooks.useCheckoutSummaryQuery | app/(customer)/checkout/page.tsx | CUSTOMER |
| PATCH /api/orders/checkout/payment-method | features/orders/services.updateCheckoutPaymentMethod | features/orders/hooks.useUpdateCheckoutPaymentMethodMutation | app/(customer)/checkout/page.tsx | CUSTOMER |
| POST /api/orders | features/orders/services.createOrder | features/orders/hooks.useCreateOrderMutation | app/(customer)/checkout/page.tsx | CUSTOMER |
| GET /api/orders/my | features/orders/services.fetchMyOrders | features/orders/hooks.useMyOrdersQuery | app/(customer)/orders/page.tsx | CUSTOMER |
| GET /api/orders/my/history | features/orders/services.fetchMyOrderHistory | features/orders/hooks.useMyOrderHistoryQuery | app/(customer)/orders/page.tsx | CUSTOMER |
| GET /api/orders/my/{orderId} | features/orders/services.fetchMyOrder | features/orders/hooks.useMyOrderQuery | app/(customer)/orders/[orderId]/page.tsx | CUSTOMER |
| GET /api/orders/my/{orderId}/payment | features/orders/services.fetchMyOrderPayment | features/orders/hooks.useMyOrderPaymentQuery | app/(customer)/orders/[orderId]/payment/page.tsx | CUSTOMER |
| GET /api/orders/my/{orderId}/status | features/orders/services.fetchMyOrderStatus | features/orders/hooks.useMyOrderStatusQuery | app/(customer)/orders/[orderId]/page.tsx | CUSTOMER |
| PATCH /api/orders/my/{orderId}/cancel | features/orders/services.cancelMyOrder | features/orders/hooks.useCancelMyOrderMutation | app/(customer)/orders/[orderId]/page.tsx | CUSTOMER |
| GET /api/orders | features/orders/services.fetchOrders | features/orders/hooks.useOrdersQuery | app/(staff)/orders/page.tsx | STAFF ADMIN |
| GET /api/orders/manage | features/orders/services.fetchManageOrders | features/orders/hooks.useManageOrdersQuery | app/(staff)/orders/page.tsx | STAFF ADMIN |
| GET /api/orders/manage/{orderId} | features/orders/services.fetchManageOrder | features/orders/hooks.useManageOrderQuery | app/(staff)/orders/[orderId]/page.tsx | STAFF ADMIN |
| GET /api/orders/{orderId} | features/orders/services.fetchOrder | features/orders/hooks.useOrderQuery | app/(staff)/orders/[orderId]/page.tsx | STAFF ADMIN |
| PATCH /api/orders/{orderId}/status | features/orders/services.updateOrderStatus | features/orders/hooks.useUpdateOrderStatusMutation | app/(staff)/orders/[orderId]/page.tsx | STAFF ADMIN |
| PATCH /api/orders/manage/{orderId}/status | features/orders/services.updateManageOrderStatus | features/orders/hooks.useUpdateManageOrderStatusMutation | app/(staff)/orders/[orderId]/page.tsx | STAFF ADMIN |
| POST /api/payments/orders/{orderId}/pay | features/payments/services.payOrder | features/payments/hooks.usePayOrderMutation | app/(customer)/orders/[orderId]/payment/page.tsx | CUSTOMER |
| POST /api/payments | features/payments/services.createPayment | features/payments/hooks.useCreatePaymentMutation | app/(customer)/orders/[orderId]/payment/page.tsx | CUSTOMER |
| GET /api/payments/orders/{orderId} | features/payments/services.fetchOrderPayment | features/payments/hooks.useOrderPaymentQuery | app/(customer)/orders/[orderId]/payment/page.tsx | CUSTOMER |
| GET /api/payments/orders/{orderId}/summary | features/payments/services.fetchOrderPaymentSummary | features/payments/hooks.useOrderPaymentSummaryQuery | app/(customer)/orders/[orderId]/payment/page.tsx | CUSTOMER |
| GET /api/invoices/orders/{orderId} | features/invoices/services.fetchInvoicesByOrder | features/invoices/hooks.useInvoicesByOrderQuery | app/(customer)/orders/[orderId]/page.tsx | CUSTOMER |
| GET /api/invoices/{invoiceId} | features/invoices/services.fetchInvoice | features/invoices/hooks.useInvoiceQuery | app/(admin)/dashboard/page.tsx | ADMIN |
| GET /api/invoices/my/{invoiceId} | features/invoices/services.fetchMyInvoice | features/invoices/hooks.useMyInvoiceQuery | app/(customer)/invoices/[invoiceId]/page.tsx | CUSTOMER |
| GET /api/invoices/manage | features/invoices/services.fetchManageInvoices | features/invoices/hooks.useManageInvoicesQuery | app/(admin)/dashboard/page.tsx | ADMIN |
| GET /api/invoices/manage/{invoiceId} | features/invoices/services.fetchManageInvoice | features/invoices/hooks.useManageInvoiceQuery | app/(admin)/dashboard/page.tsx | ADMIN |

## Home and Dashboard

| Endpoint | Service | Hook | Screen | Role |
|---|---|---|---|---|
| GET /api/home | features/home/services.fetchHome | features/home/hooks.useHomeQuery | app/(public)/page.tsx | GUEST |
| GET /api/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD | features/dashboard/services.fetchDashboard | features/dashboard/hooks.useDashboardQuery | app/(admin)/dashboard/page.tsx | ADMIN |
