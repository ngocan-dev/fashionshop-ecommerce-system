import { api, apiRequest } from '@/lib/api/http';
import type { ApiResponse } from '@/lib/api/types';
import type { Payment, PayOrderRequest } from '@/types/payment';

export async function payOrder(orderId: string, request: PayOrderRequest) {
  const response = await api.post<ApiResponse<Payment>>(`/api/payments/orders/${orderId}/pay`, request);
  return apiRequest(Promise.resolve(response));
}

export async function createPayment(request: PayOrderRequest) {
  const response = await api.post<ApiResponse<Payment>>('/api/payments', request);
  return apiRequest(Promise.resolve(response));
}

export async function fetchOrderPayment(orderId: string) {
  const response = await api.get<ApiResponse<Payment>>(`/api/payments/orders/${orderId}`);
  return apiRequest(Promise.resolve(response));
}

export async function fetchOrderPaymentSummary(orderId: string) {
  const response = await api.get<ApiResponse<Payment>>(`/api/payments/orders/${orderId}/summary`);
  return apiRequest(Promise.resolve(response));
}
