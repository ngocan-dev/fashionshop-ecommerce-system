'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingState } from '@/components/common/loading-state';
import { useManageOrderQuery, useUpdateManageOrderStatusMutation } from '@/features/orders/hooks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function StaffOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const orderQuery = useManageOrderQuery(params.orderId);
  const mutation = useUpdateManageOrderStatusMutation(params.orderId);

  if (orderQuery.isLoading) return <LoadingState label="Loading order" />;
  if (!orderQuery.data) return <EmptyState title="Order not found" actionLabel="Back" actionHref="/staff/orders" />;

  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-semibold">Order detail</h1>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>Status: {orderQuery.data.status}</div>
        <div className="flex gap-2">
          {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
            <Button key={status} variant="outline" onClick={() => mutation.mutate(status, { onSuccess: () => toast.success('Status updated') })}>{status}</Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
