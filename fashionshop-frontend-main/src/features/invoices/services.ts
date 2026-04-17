import { api, apiRequest } from '@/lib/api/http';
import type { ApiResponse } from '@/lib/api/types';
import type { Invoice } from '@/types/invoice';

export async function fetchInvoicesByOrder(orderId: string) {
  const response = await api.get<ApiResponse<Invoice>>(`/api/invoices/orders/${orderId}`);
  return apiRequest(Promise.resolve(response));
}

export async function fetchInvoice(invoiceId: string) {
  const response = await api.get<ApiResponse<Invoice>>(`/api/invoices/${invoiceId}`);
  return apiRequest(Promise.resolve(response));
}

export async function fetchMyInvoice(invoiceId: string) {
  const response = await api.get<ApiResponse<Invoice>>(`/api/invoices/my/${invoiceId}`);
  return apiRequest(Promise.resolve(response));
}

export async function fetchManageInvoices() {
  const response = await api.get<ApiResponse<Invoice[]>>('/api/invoices/manage');
  return apiRequest(Promise.resolve(response));
}

export async function fetchManageInvoice(invoiceId: string) {
  const response = await api.get<ApiResponse<Invoice>>(`/api/invoices/manage/${invoiceId}`);
  return apiRequest(Promise.resolve(response));
}
