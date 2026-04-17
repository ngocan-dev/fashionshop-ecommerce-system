'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/common/data-table';
import { LoadingState } from '@/components/common/loading-state';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common/form-field';
import { useCategoriesQuery, useCreateCategoryMutation } from '@/features/categories/hooks';
import { toast } from 'sonner';

const categorySchema = z.object({ name: z.string().min(2), slug: z.string().min(2), description: z.string().optional() });
type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const categoriesQuery = useCategoriesQuery();
  const mutation = useCreateCategoryMutation();
  const form = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema), defaultValues: { name: '', slug: '', description: '' } });

  if (categoriesQuery.isLoading) return <LoadingState label="Loading categories" />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><h1 className="text-2xl font-semibold">Category management</h1></CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={form.handleSubmit((values) => mutation.mutate(values, { onSuccess: () => toast.success('Category created') }))}>
            <FormField<CategoryFormValues> label="Name" name="name" register={form.register} error={form.formState.errors.name} />
            <FormField<CategoryFormValues> label="Slug" name="slug" register={form.register} error={form.formState.errors.slug} />
            <FormField<CategoryFormValues> label="Description" name="description" register={form.register} error={form.formState.errors.description} />
            <div className="md:col-span-3"><Button type="submit">Create category</Button></div>
          </form>
        </CardContent>
      </Card>

      {!categoriesQuery.data || categoriesQuery.data.length === 0 ? (
        <EmptyState title="No categories" actionLabel="Create category" actionHref="/staff/categories" />
      ) : (
        <DataTable data={categoriesQuery.data} columns={[{ header: 'Name', cell: (category) => category.name }, { header: 'Slug', cell: (category) => category.slug }, { header: 'Description', cell: (category) => category.description ?? '-' }]} />
      )}
    </div>
  );
}
