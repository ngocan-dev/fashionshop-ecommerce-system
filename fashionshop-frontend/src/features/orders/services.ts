import { api, apiRequest } from '@/lib/api/http';
import type { ApiResponse } from '@/lib/api/types';
import type { CheckoutSummary, CreateOrderRequest, Order, OrderFilter, OrderSummaryItem } from '@/types/order';
import type { Payment } from '@/types/payment';
import { mockOrders, getMockOrder } from '@/data/mock-data';

const USE_MOCK = false;
type OrderItemResponse = Omit<Partial<OrderSummaryItem>, 'productId'> & { productId?: string | number; unitPrice?: number; productName?: string; lineTotal?: number; productImage?: string };
type OrderResponse = Omit<Partial<Order>, 'id' | 'items'> & {
  id?: string | number; orderId?: string | number; orderCode?: string;
  receiverName?: string; phone?: string; orderStatus?: string; currentStatus?: string;
  orderDate?: string; totalAmount?: number; totalPrice?: number; discountAmount?: number; customerNote?: string;
  summary?: { orderId?: string | number; orderStatus?: string; customerName?: string; customerEmail?: string; customerPhone?: string; orderDate?: string; totalAmount?: number; subtotal?: number; shippingFee?: number; discountAmount?: number };
  customer?: { fullName?: string; email?: string; phoneNumber?: string; shippingAddress?: string };
  additionalInfo?: { createdAt?: string; customerNote?: string };
  items?: OrderItemResponse[];
};
type CheckoutResponse = Omit<CheckoutSummary, 'items'> & { items: OrderItemResponse[] };
type OrderPage = { items: OrderResponse[]; total?: number; totalItems?: number; totalPages: number; page: number; size: number };

function normalizeOrderStatus(value: unknown): Order['status'] {
  if (typeof value !== 'string' || !value.trim()) {
    return 'PENDING';
  }

  const normalized = value.trim().toUpperCase();
  switch (normalized) {
    case 'PENDING':
    case 'CONFIRMED':
    case 'PROCESSING':
    case 'SHIPPED':
    case 'DELIVERED':
    case 'COMPLETED':
    case 'CANCELLED':
      return normalized;
    default:
      return 'PENDING';
  }
}

function normalizeOrderItem(raw: OrderItemResponse): OrderSummaryItem {
  const price = raw.price ?? raw.unitPrice ?? 0;
  const qty = raw.quantity ?? 0;
  return {
    productId: String(raw.productId ?? ''),
    name: raw.name ?? raw.productName ?? '',
    quantity: qty,
    price,
    total: raw.total ?? raw.lineTotal ?? price * qty,
    imageUrl: raw.imageUrl ?? raw.productImage ?? undefined,
  };
}

function normalizeOrder(raw: OrderResponse): Order {
  const summary = raw.summary || {};
  const customer = raw.customer || {};
  const additionalInfo = raw.additionalInfo || {};
  const rawStatus = raw.status || raw.orderStatus || raw.currentStatus || summary.orderStatus;
  
  return {
    ...raw,
    id: raw.id ? String(raw.id) : (raw.orderId ? String(raw.orderId) : (summary.orderId ? String(summary.orderId) : raw.orderCode ?? '')),
    customerName: raw.customerName || raw.receiverName || summary.customerName || customer.fullName || '',
    customerEmail: raw.customerEmail || summary.customerEmail || customer.email || '',
    customerPhone: raw.customerPhone || summary.customerPhone || customer.phoneNumber || raw.phone || '',
    status: normalizeOrderStatus(rawStatus),
    createdAt: raw.createdAt || raw.orderDate || summary.orderDate || additionalInfo.createdAt || new Date().toISOString(),
    total: raw.total ?? raw.totalAmount ?? summary.totalAmount ?? raw.totalPrice ?? 0,
    subtotal: raw.subtotal ?? summary.subtotal ?? raw.totalPrice ?? 0,
    shippingFee: raw.shippingFee ?? summary.shippingFee ?? 0,
    discount: raw.discount ?? raw.discountAmount ?? summary.discountAmount ?? 0,
    shippingAddress: raw.shippingAddress ?? customer.shippingAddress ?? '',
    note: raw.note ?? raw.customerNote ?? additionalInfo.customerNote ?? '',
    items: Array.isArray(raw.items) ? raw.items.map(normalizeOrderItem) : [],
  };
}

function filterOrders(orders: Order[], filter?: OrderFilter): Order[] {
  let filteredItems = [...orders];

  if (filter?.keyword) {
    const keyword = filter.keyword.trim().toLowerCase();
    if (keyword) {
      filteredItems = filteredItems.filter((order) =>
        order.orderNumber?.toLowerCase().includes(keyword) ||
        order.customerName?.toLowerCase().includes(keyword) ||
        order.customerEmail?.toLowerCase().includes(keyword) ||
        order.id.toLowerCase().includes(keyword),
      );
    }
  }

  if (filter?.status) {
    filteredItems = filteredItems.filter((order) => order.status === filter.status);
  }

  return filteredItems;
}

function normalizeCheckoutSummary(raw: CheckoutResponse): CheckoutSummary {
  return {
    ...raw,
    items: Array.isArray(raw.items) ? raw.items.map(normalizeOrderItem) : [],
  };
}

export async function fetchCheckoutSummary(): Promise<CheckoutSummary> {
  if (USE_MOCK) {
    return {
      cartId: 1,
      empty: false,
      availablePaymentMethods: ['COD', 'MOMO', 'BANKING'],
      selectedPaymentMethod: 'COD',
      items: [],
      totalItems: 0,
      distinctItemCount: 0,
      subtotal: 0,
      shippingFee: 0,
      discountAmount: 0,
      finalTotal: 0,
    };
  }
  const response = await api.get<ApiResponse<CheckoutResponse>>('/api/orders/checkout-summary');
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeCheckoutSummary(raw);
}

export async function updateCheckoutPaymentMethod(paymentMethod: string) {
  const response = await api.patch<ApiResponse<CheckoutResponse>>('/api/orders/checkout/payment-method', { paymentMethod });
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeCheckoutSummary(raw);
}

export async function createOrder(request: CreateOrderRequest) {
  if (USE_MOCK) {
    return {
      id: `ORD-${Date.now()}`,
      status: 'PENDING',
      paymentMethod: request.paymentMethod,
      shippingAddress: request.shippingAddress,
      note: request.note ?? '',
      items: [],
      total: 0,
      createdAt: new Date().toISOString(),
    } as unknown as Order;
  }
  const response = await api.post<ApiResponse<OrderResponse>>('/api/orders', request);
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}

export async function fetchMyOrders() {
  if (USE_MOCK) return mockOrders;
  const response = await api.get<ApiResponse<OrderResponse[]>>('/api/orders/my');
  const raw = await apiRequest(Promise.resolve(response));
  return Array.isArray(raw) ? raw.map(normalizeOrder) : [];
}

export async function fetchMyOrderHistory() {
  if (USE_MOCK) return mockOrders;
  const response = await api.get<ApiResponse<OrderPage>>('/api/orders/my/history');
  const raw = await apiRequest(Promise.resolve(response));
  // history returns paginated: { items: [], ... }
  if (raw && Array.isArray(raw.items)) return { ...raw, items: raw.items.map(normalizeOrder) };
  return Array.isArray(raw) ? raw.map(normalizeOrder) : raw;
}

export async function fetchMyOrder(orderId: string) {
  const response = await api.get<ApiResponse<OrderResponse>>(`/api/orders/my/${orderId}`);
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}

export async function fetchMyOrderPayment(orderId: string) {
  const response = await api.get<ApiResponse<Payment>>(`/api/orders/my/${orderId}/payment`);
  return apiRequest(Promise.resolve(response));
}

export async function fetchMyOrderStatus(orderId: string) {
  const response = await api.get<ApiResponse<string>>(`/api/orders/my/${orderId}/status`);
  return apiRequest(Promise.resolve(response));
}

export async function cancelMyOrder(orderId: string) {
  const response = await api.patch<ApiResponse<OrderResponse>>(`/api/orders/my/${orderId}/cancel`);
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}

export async function fetchOrders() {
  const response = await api.get<ApiResponse<OrderResponse[]>>('/api/orders');
  const raw = await apiRequest(Promise.resolve(response));
  return Array.isArray(raw) ? raw.map(normalizeOrder) : [];
}

export async function fetchManageOrders(filter?: OrderFilter) {
  if (USE_MOCK) {
    const filteredItems = filterOrders(mockOrders, filter);

    const page = filter?.page ?? 0;
    const size = filter?.size ?? 10;
    const start = page * size;
    const paginatedItems = filteredItems.slice(start, start + size);

    return {
      items: paginatedItems,
      total: filteredItems.length,
      totalItems: filteredItems.length,
      totalPages: Math.ceil(filteredItems.length / size),
      page,
      size,
    };
  }

  const response = await api.get<ApiResponse<OrderPage>>('/api/orders', { params: filter });
  const raw = await apiRequest(Promise.resolve(response));
  if (raw && Array.isArray(raw.items)) {
    return {
      ...raw,
      total: raw.total ?? raw.totalItems ?? 0,
      totalItems: raw.totalItems ?? raw.total ?? 0,
      items: raw.items.map(normalizeOrder),
    };
  }

  return {
    items: [],
    total: 0,
    totalItems: 0,
    totalPages: 0,
    page: filter?.page ?? 0,
    size: filter?.size ?? 10,
  };
}

export async function fetchManageOrder(orderId: string) {
  if (USE_MOCK) return getMockOrder(orderId);
  const response = await api.get<ApiResponse<OrderResponse>>(`/api/orders/manage/${orderId}`);
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}

export async function fetchOrder(orderId: string) {
  const response = await api.get<ApiResponse<OrderResponse>>(`/api/orders/${orderId}`);
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}

export async function updateOrderStatus(orderId: string, status: string) {
  const response = await api.patch<ApiResponse<OrderResponse>>(`/api/orders/${orderId}/status`, { status });
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}

export async function updateManageOrderStatus(orderId: string, status: string) {
  if (USE_MOCK) {
    const index = mockOrders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      mockOrders[index] = {
        ...mockOrders[index],
        status: normalizeOrderStatus(status),
        activityLog: [
          {
            status: `Order ${status.toLowerCase()}`,
            timestamp: new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            }),
            isPrimary: true
          },
          ...(mockOrders[index].activityLog || []).map(log => ({ ...log, isPrimary: false }))
        ]
      };
      return mockOrders[index];
    }
  }
  const response = await api.patch<ApiResponse<OrderResponse>>(`/api/orders/manage/${orderId}/status`, { status });
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}
