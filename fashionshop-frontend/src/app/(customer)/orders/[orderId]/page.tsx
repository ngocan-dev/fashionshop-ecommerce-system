'use client';

import { useParams } from 'next/navigation';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingState } from '@/components/common/loading-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCancelMyOrderMutation, useMyOrderQuery } from '@/features/orders/hooks';

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const orderQuery = useMyOrderQuery(params.orderId);
  const cancelMutation = useCancelMyOrderMutation(params.orderId);

  if (orderQuery.isLoading) return <LoadingState label="Loading order" />;
  if (!orderQuery.data) return <EmptyState title="Order not found" actionLabel="Back to orders" actionHref="/orders" />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Order {orderQuery.data.orderNumber ?? orderQuery.data.id}</h1>
          <Button variant="outline" onClick={() => cancelMutation.mutate()}>Cancel order</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {orderQuery.data.items.map((item) => (
          <div key={item.productId} className="flex justify-between rounded-2xl bg-muted/30 p-4">
            <span>{item.name} x {item.quantity}</span>
            <strong>${item.total.toFixed(2)}</strong>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
