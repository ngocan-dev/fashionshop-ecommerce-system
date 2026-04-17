import { api, apiRequest } from '@/lib/api/http';
import type { ApiListResponse, ApiResponse } from '@/lib/api/types';
import type { CheckoutSummary, CreateOrderRequest, Order, OrderFilter, OrderSummaryItem } from '@/types/order';
import type { Payment } from '@/types/payment';
import { mockOrders, getMockOrder, mockCart } from '@/data/mock-data';

// TODO: Remove mock helpers once the real backend is available
const USE_MOCK = false;

// ---------------------------------------------------------------------------
// Normalizers: bridge backend field names → frontend type field names
// ---------------------------------------------------------------------------

function normalizeOrderItem(raw: any): OrderSummaryItem {
  const price = raw.price ?? raw.unitPrice ?? 0;
  const qty = raw.quantity ?? 0;
  return {
    productId: raw.productId,
    name: raw.name ?? raw.productName ?? '',
    quantity: qty,
    price,
    total: raw.total ?? raw.lineTotal ?? price * qty,
    imageUrl: raw.imageUrl ?? raw.productImage ?? undefined,
  };
}

function normalizeOrder(raw: any): Order {
  return {
    ...raw,
    total: raw.total ?? raw.totalPrice ?? 0,
    subtotal: raw.subtotal ?? raw.totalPrice ?? 0,
    shippingFee: raw.shippingFee ?? 0,
    discount: raw.discount ?? raw.discountAmount ?? 0,
    items: Array.isArray(raw.items) ? raw.items.map(normalizeOrderItem) : [],
  };
}

function normalizeCheckoutSummary(raw: any): CheckoutSummary {
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
  const response = await api.get<ApiResponse<any>>('/api/orders/checkout-summary');
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeCheckoutSummary(raw);
}

export async function updateCheckoutPaymentMethod(paymentMethod: string) {
  const response = await api.patch<ApiResponse<any>>('/api/orders/checkout/payment-method', { paymentMethod });
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
  const response = await api.post<ApiResponse<any>>('/api/orders', request);
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}

export async function fetchMyOrders() {
  if (USE_MOCK) return mockOrders;
  const response = await api.get<ApiResponse<any[]>>('/api/orders/my');
  const raw = await apiRequest(Promise.resolve(response));
  return Array.isArray(raw) ? raw.map(normalizeOrder) : [];
}

export async function fetchMyOrderHistory() {
  if (USE_MOCK) return mockOrders;
  const response = await api.get<ApiResponse<any>>('/api/orders/my/history');
  const raw = await apiRequest(Promise.resolve(response));
  // history returns paginated: { items: [], ... }
  if (raw && Array.isArray(raw.items)) return { ...raw, items: raw.items.map(normalizeOrder) };
  return Array.isArray(raw) ? raw.map(normalizeOrder) : raw;
}

export async function fetchMyOrder(orderId: string) {
  const response = await api.get<ApiResponse<any>>(`/api/orders/my/${orderId}`);
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
  const response = await api.patch<ApiResponse<any>>(`/api/orders/my/${orderId}/cancel`);
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}

export async function fetchOrders() {
  const response = await api.get<ApiResponse<any[]>>('/api/orders');
  const raw = await apiRequest(Promise.resolve(response));
  return Array.isArray(raw) ? raw.map(normalizeOrder) : [];
}

export async function fetchManageOrders(filter?: OrderFilter) {
  if (USE_MOCK) {
    let filteredItems = [...mockOrders];

    if (filter?.keyword) {
      const k = filter.keyword.toLowerCase();
      filteredItems = filteredItems.filter(o => 
        o.orderNumber?.toLowerCase().includes(k) || 
        o.customerName?.toLowerCase().includes(k) ||
        o.id.toLowerCase().includes(k)
      );
    }

    if (filter?.status) {
      filteredItems = filteredItems.filter(o => o.status === filter.status);
    }

    const page = filter?.page ?? 0;
    const size = filter?.size ?? 10;
    const start = page * size;
    const paginatedItems = filteredItems.slice(start, start + size);

    return {
      items: paginatedItems,
      total: filteredItems.length,
      page,
      size,
    };
  }
  const response = await api.get<ApiResponse<any>>('/api/orders/manage', { params: filter });
  const raw = await apiRequest(Promise.resolve(response));
  if (raw && Array.isArray(raw.items)) return { ...raw, items: raw.items.map(normalizeOrder) };
  return raw;
}

export async function fetchManageOrder(orderId: string) {
  if (USE_MOCK) return getMockOrder(orderId);
  const response = await api.get<ApiResponse<any>>(`/api/orders/manage/${orderId}`);
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}

export async function fetchOrder(orderId: string) {
  const response = await api.get<ApiResponse<any>>(`/api/orders/${orderId}`);
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}

export async function updateOrderStatus(orderId: string, status: string) {
  const response = await api.patch<ApiResponse<any>>(`/api/orders/${orderId}/status`, { status });
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}

export async function updateManageOrderStatus(orderId: string, status: string) {
  if (USE_MOCK) {
    const index = mockOrders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      mockOrders[index] = {
        ...mockOrders[index],
        status: status as any,
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
  const response = await api.patch<ApiResponse<any>>(`/api/orders/manage/${orderId}/status`, { status });
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeOrder(raw);
}
