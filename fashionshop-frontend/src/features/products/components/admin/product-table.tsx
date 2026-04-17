'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { Product } from '@/types/product';

type Props = {
  products: Product[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
};

export function ProductTable({ products, onDelete, isLoading }: Props) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-neutral-100">
          <th className="px-6 py-5 text-[10px] uppercase text-neutral-400 text-center w-24 tracking-widest font-bold">Image</th>
          <th className="px-6 py-5 text-[10px] uppercase text-neutral-400 tracking-widest font-bold">Product Name</th>
          <th className="px-6 py-5 text-[10px] uppercase text-neutral-400 tracking-widest font-bold">Category</th>
          <th className="px-6 py-5 text-[10px] uppercase text-neutral-400 tracking-widest font-bold">Stock</th>
          <th className="px-6 py-5 text-[10px] uppercase text-neutral-400 tracking-widest font-bold">Price</th>
          <th className="px-6 py-5 text-[10px] uppercase text-neutral-400 tracking-widest font-bold">Status</th>
          <th className="px-6 py-5 text-[10px] uppercase text-neutral-400 tracking-widest font-bold text-right">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-neutral-50 font-body">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-6 py-4">
                <div className="w-12 h-16 mx-auto rounded bg-neutral-100" />
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-neutral-100 rounded" />
                  <div className="h-3 w-20 bg-neutral-100 rounded" />
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="h-5 w-16 bg-neutral-100 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-10 bg-neutral-100 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-12 bg-neutral-100 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-16 bg-neutral-100 rounded-full" />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="h-4 w-10 bg-neutral-100 rounded ml-auto" />
              </td>
            </tr>
          ))
        ) : products.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-6 py-20 text-center text-neutral-500 text-sm">
              No products found
            </td>
          </tr>
        ) : (
          products.map((product) => {
          return (
            <tr key={product.id} className="hover:bg-surface-container-low/50 group">
              {/* Image */}
              <td className="px-6 py-4">
                <div className="relative w-12 h-16 mx-auto rounded overflow-hidden bg-neutral-100">
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </td>

              {/* Name */}
              <td className="px-6 py-4">
                <p className="font-bold text-sm">{product.name}</p>
                <p className="text-[10px] text-neutral-400 uppercase">
                  SKU: {product.slug?.toUpperCase() || product.id.toString().slice(-8).toUpperCase()}
                </p>
              </td>

              {/* Category */}
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-neutral-100 rounded text-[10px] uppercase">
                  {product.categoryName || 'Uncategorized'}
                </span>
              </td>

              {/* Stock */}
              <td className="px-6 py-4 text-sm">{product.stockQuantity}</td>

              {/* Price */}
              <td className="px-6 py-4 font-semibold">
                ${product.price.toLocaleString()}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className={cn('w-1.5 h-1.5 rounded-full', product.isActive ? 'bg-green-500' : 'bg-neutral-400')} />
                  <span className={cn('text-[11px] uppercase', product.isActive ? 'text-black' : 'text-neutral-500')}>
                    {product.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    ✏️
                  </Link>
                  <button onClick={() => onDelete(product.id)}>
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          );
        })
        )}
      </tbody>
    </table>
  );
}