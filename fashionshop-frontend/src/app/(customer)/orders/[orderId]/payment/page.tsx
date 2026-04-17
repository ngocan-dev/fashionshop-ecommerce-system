'use client';

import { useParams } from 'next/navigation';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingState } from '@/components/common/loading-state';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useMyOrderPaymentQuery } from '@/features/orders/hooks';

export default function OrderPaymentPage() {
  const params = useParams<{ orderId: string }>();
  const paymentQuery = useMyOrderPaymentQuery(params.orderId);

  if (paymentQuery.isLoading) return <LoadingState label="Loading payment" />;
  if (!paymentQuery.data) return <EmptyState title="Payment not found" actionLabel="Back to orders" actionHref="/orders" />;

  return (
    <Card>
      <CardHeader><h1 className="text-2xl font-semibold">Payment detail</h1></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>Method: {paymentQuery.data.paymentMethod}</div>
        <div>Status: {paymentQuery.data.paymentStatus}</div>
      </CardContent>
    </Card>
  );
}
