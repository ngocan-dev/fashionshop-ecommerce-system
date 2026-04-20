'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { Pagination } from '@/components/common/pagnition';
import { ProductTable } from '@/features/products/components/admin/product-table';
import { ProductStats } from '@/features/products/components/product-stats';
import { AdminProductsFilters } from '@/features/products/components/admin/admin-products-filters';
import { useDeleteManageProductMutation, useManageProductsQuery } from '@/features/products/hooks';
import type { Product } from '@/types/product';

export default function StaffProductsPage() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const pageSize = 8;

  const { data, isLoading } = useManageProductsQuery({
    page,
    size: pageSize,
    keyword: searchTerm,
    categoryId: categoryId ?? undefined,
  });

  const deleteMutation = useDeleteManageProductMutation();
  const products: Product[] = data?.items ?? [];

  const handleDelete = () => {
    if (!deleteId) return;

    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('Product deleted successfully');
        setDeleteId(null);
      },
      onError: () => toast.error('Failed to delete product'),
    });
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-10 bg-white min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-black/20" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400">Inventory Management</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase font-headline text-black">
            Staff Products
          </h1>
        </div>
        <div className="flex gap-4">
          <Link
            href="/staff/products/new"
            className="flex items-center gap-2 px-8 py-3 bg-black text-white hover:bg-zinc-800 transition-all active:scale-95 rounded-md"
          >
            <span className="material-symbols-outlined text-lg text-white">add</span>
            <span className="font-label text-xs tracking-widest uppercase font-bold text-white">Add Product</span>
          </Link>
        </div>
      </header>

      <ProductStats
        totalItems={data?.total || 0}
        outOfStock={products.filter((p) => p.stockQuantity === 0).length}
        active={products.filter((p) => p.isActive).length}
      />

      <AdminProductsFilters
        categoryId={categoryId}
        onCategoryChange={(id) => {
          setCategoryId(id);
          setPage(0);
        }}
        searchTerm={searchTerm}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(0);
        }}
      />

      <div className="space-y-8">
        <ProductTable
          products={products}
          isLoading={isLoading}
          onDelete={setDeleteId}
          editBasePath="/staff/products"
        />

        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center pt-8 border-t border-neutral-100">
            <Pagination
              page={page + 1}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={data?.total || 0}
              onPageChange={(p) => setPage(p - 1)}
            />
          </div>
        )}
      </div>

      <footer className="pt-12 border-t border-neutral-100 flex flex-col items-center gap-4">
        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-300">
          Studio 18 · Staff Portal · {new Date().getFullYear()}
        </p>
      </footer>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete product?"
        description="Are you sure you want to delete this product? This action cannot be undone and will remove the item from all listings."
        destructive
        confirmLabel="Delete"
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
