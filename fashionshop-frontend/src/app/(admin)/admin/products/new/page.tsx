'use client';

import Link from 'next/link';
import { ProductForm } from '@/features/products/components/product-form';

export default function AddProductPage() {
  return (
    <div className="max-w-7xl mx-auto px-10 py-12">
      {/* Header Section */}
      <ProductForm />
    </div>
  );
}
