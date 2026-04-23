'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoadingState } from '@/components/common/loading-state';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { useCategoriesQuery, useCreateCategoryMutation } from '@/features/categories/hooks';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type CategoryManagementViewProps = {
  emptyActionHref: string;
};

export function CategoryManagementView({ emptyActionHref }: CategoryManagementViewProps) {
  const categoriesQuery = useCategoriesQuery();
  const mutation = useCreateCategoryMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '' },
  });

  const categories = categoriesQuery.data ?? [];
  const filteredCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return categories;

    return categories.filter((category) =>
      [category.name, category.description ?? ''].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    );
  }, [categories, searchTerm]);

  if (categoriesQuery.isLoading) return <LoadingState label="Loading categories" />;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-10 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase font-headline text-black">
            Categories
          </h1>
          <p className="text-sm text-neutral-500 font-body max-w-2xl">
            Create and review product categories used across the storefront and management screens.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => setIsCreateOpen((value) => !value)}
            className="flex items-center gap-2 px-8 py-3 bg-black text-white hover:bg-zinc-800 transition-all active:scale-95 rounded-md"
          >
            <span className="material-symbols-outlined text-lg text-white">
              {isCreateOpen ? 'close' : 'add'}
            </span>
            <span className="font-label text-xs tracking-widest uppercase font-bold text-white">
              {isCreateOpen ? 'Close Form' : 'Add Category'}
            </span>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 mb-12">
        <div className="col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-xl">
          <p className="font-label text-[10px] tracking-widest uppercase text-neutral-500 mb-1">
            Total Categories
          </p>
          <p className="font-headline text-3xl font-bold tracking-tighter">
            {categories.length.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            <span>Available for product assignment</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 bg-surface-container-low p-8 rounded-xl flex items-center">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
              search
            </span>
            <input
              className="w-full bg-white border border-neutral-200 rounded-lg py-3 pl-10 pr-4 text-xs font-body focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="Search by category name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isCreateOpen ? (
        <section className="rounded-3xl border border-neutral-200 bg-surface-container-lowest p-8 shadow-sm">
          <div className="mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-400">New category</span>
            <h2 className="mt-3 text-2xl font-black tracking-tight font-headline text-black">Add to catalog</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Keep the naming clean and use the description to clarify what products belong in this group.
            </p>
          </div>

          <form
            className="grid grid-cols-12 gap-6"
            onSubmit={form.handleSubmit((values) =>
              mutation.mutate(values, {
                onSuccess: () => {
                  toast.success('Category created');
                  form.reset();
                  setIsCreateOpen(false);
                },
              }),
            )}
          >
            <div className="col-span-12 lg:col-span-4 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">Category name</label>
              <input
                {...form.register('name')}
                type="text"
                placeholder="e.g. Outerwear"
                className={cn(
                  'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-black outline-none transition-all placeholder:text-neutral-300 focus:ring-1 focus:ring-black',
                  form.formState.errors.name && 'border-red-400/70'
                )}
              />
              {form.formState.errors.name ? (
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            <div className="col-span-12 lg:col-span-8 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">Description</label>
              <textarea
                {...form.register('description')}
                rows={4}
                placeholder="Describe the kind of products that should appear in this category."
                className={cn(
                  'w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-black outline-none transition-all placeholder:text-neutral-300 focus:ring-1 focus:ring-black',
                  form.formState.errors.description && 'border-red-400/70'
                )}
              />
              {form.formState.errors.description ? (
                <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>
              ) : null}
            </div>

            <div className="col-span-12 flex items-center gap-4 pt-2">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-black text-white px-8 rounded-md text-[10px] font-bold tracking-widest uppercase hover:bg-neutral-800"
              >
                {mutation.isPending ? 'Creating...' : 'Create Category'}
              </Button>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-black"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <div className="space-y-8">
        <div className="rounded-3xl border border-neutral-200 bg-surface-container-lowest p-3 shadow-sm overflow-x-auto">
          {categories.length === 0 ? (
            <EmptyState
              title="No categories"
              description="Create the first category to organize products in the dashboard and storefront."
              actionLabel="Create category"
              actionHref={emptyActionHref}
            />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-6 py-5 text-[10px] uppercase text-neutral-400 tracking-widest font-bold">Category Name</th>
                  <th className="px-6 py-5 text-[10px] uppercase text-neutral-400 tracking-widest font-bold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 font-body">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-20 text-center text-neutral-500 text-sm">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => {
                    return (
                      <tr key={category.id} className="hover:bg-surface-container-low/50 group">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-sm text-black">{category.name}</p>
                            <p className="text-[10px] text-neutral-400 uppercase">
                              ID: {String(category.id).toUpperCase()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-neutral-600 leading-relaxed">
                            {category.description?.trim() || 'No description provided yet.'}
                          </p>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
