'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductTable } from "@/features/products/components/admin/product-table";
import { ProductStats } from "@/features/products/components/product-stats";
import { Pagination } from "@/components/common/pagnition";
import { AdminProductsFilters } from "@/features/products/components/admin/admin-products-filters";
import { useDeleteManageProductMutation, useManageProductsQuery } from "@/features/products/hooks";
import { toast } from 'sonner';

export default function StaffProductsPage() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const pageSize = 8;

  const { data, isLoading } = useManageProductsQuery({
    page,
    size: pageSize,
    keyword: searchTerm,
    categoryId: categoryId ?? undefined,
  });

  const deleteMutation = useDeleteManageProductMutation();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('Product deleted successfully'),
      onError: () => toast.error('Failed to delete product'),
    });
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-10 bg-white min-h-screen">
      {/* Header */}
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

      {/* Stats Section */}
      <ProductStats 
        totalItems={data?.total || 0}
        outOfStock={data?.items.filter(p => p.stockQuantity === 0).length || 0}
        active={data?.items.filter(p => p.isActive).length || 0}
      />

      {/* Filters Section */}
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

      {/* Main Table Content */}
      <div className="space-y-8">
        <ProductTable 
          products={data?.items || []} 
          isLoading={isLoading} 
          onDelete={handleDelete}
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

      {/* Footer Info */}
      <footer className="pt-12 border-t border-neutral-100 flex flex-col items-center gap-4">
        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-300">
          Studio 18 • Staff Portal • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
