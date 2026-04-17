'use client';

import { useParams } from 'next/navigation';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingState } from '@/components/common/loading-state';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useMyInvoiceQuery } from '@/features/invoices/hooks';

export default function InvoiceDetailPage() {
  const params = useParams<{ invoiceId: string }>();
  const invoiceQuery = useMyInvoiceQuery(params.invoiceId);

  if (invoiceQuery.isLoading) return <LoadingState label="Loading invoice" />;
  if (!invoiceQuery.data) return <EmptyState title="Invoice not found" actionLabel="Back to orders" actionHref="/orders" />;

  return (
    <Card>
      <CardHeader><h1 className="text-2xl font-semibold">Invoice detail</h1></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>Invoice #: {invoiceQuery.data.invoiceNumber ?? invoiceQuery.data.id}</div>
        <div>Total: ${invoiceQuery.data.totalAmount.toFixed(2)}</div>
        <div>Status: {invoiceQuery.data.paymentStatus}</div>
      </CardContent>
    </Card>
  );
}
