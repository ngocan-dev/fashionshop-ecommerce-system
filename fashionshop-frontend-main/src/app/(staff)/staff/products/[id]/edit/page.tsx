'use client';

import { use } from 'react';
import { ProductForm } from '@/features/products/components/product-form';
import { useManageProductQuery } from '@/features/products/hooks';
import { LoadingState } from '@/components/common/loading-state';
import { EmptyState } from '@/components/common/empty-state';

type Props = {
  params: Promise<{ id: string }>;
};

export default function StaffEditProductPage({ params }: Props) {
  const { id } = use(params);
  const { data: product, isLoading, error } = useManageProductQuery(id);

  if (isLoading) return <LoadingState label="Loading product data..." />;
  
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-10 py-12">
        <EmptyState 
          title="Product Not Found" 
          description="The product you are trying to edit does not exist or has been removed."
          actionLabel="Back to Catalog"
          actionHref="/staff/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-10 py-12">
      <ProductForm initialData={product} />
    </div>
  );
}
