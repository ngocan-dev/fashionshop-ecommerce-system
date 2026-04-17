'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchInvoice, fetchInvoicesByOrder, fetchManageInvoice, fetchManageInvoices, fetchMyInvoice } from './services';
import { queryKeys } from '@/lib/api/query-keys';

export function useInvoicesByOrderQuery(orderId: string) {
  return useQuery({ queryKey: ['invoices', 'orders', orderId], queryFn: () => fetchInvoicesByOrder(orderId), enabled: Boolean(orderId) });
}

export function useInvoiceQuery(invoiceId: string) {
  return useQuery({ queryKey: queryKeys.invoices(invoiceId), queryFn: () => fetchInvoice(invoiceId), enabled: Boolean(invoiceId) });
}

export function useMyInvoiceQuery(invoiceId: string) {
  return useQuery({ queryKey: ['invoices', 'my', invoiceId], queryFn: () => fetchMyInvoice(invoiceId), enabled: Boolean(invoiceId) });
}

export function useManageInvoicesQuery() {
  return useQuery({ queryKey: ['invoices', 'manage'], queryFn: fetchManageInvoices });
}

export function useManageInvoiceQuery(invoiceId: string) {
  return useQuery({ queryKey: ['invoices', 'manage', invoiceId], queryFn: () => fetchManageInvoice(invoiceId), enabled: Boolean(invoiceId) });
}
