'use client';

import { useForm, useWatch, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCreateProductMutation, useUpdateManageProductMutation } from '@/features/products/hooks';
import { cn } from '@/lib/utils/cn';
import type { Product } from '@/types/product';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  stockQuantity: z.coerce.number().min(0, 'Stock must be at least 0'),
  categoryId: z.coerce.number().optional(),
  imageUrl: z.string().url('Must be a valid URL').or(z.string().length(0)).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  slug: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

type Props = {
  initialData?: Product;
};

export function ProductForm({ initialData }: Props) {
  const router = useRouter();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateManageProductMutation(initialData?.id || '');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      stockQuantity: initialData?.stockQuantity || 0,
      categoryId: initialData?.categoryId || 1,
      isActive: initialData?.isActive ?? true,
      isFeatured: initialData?.isFeatured ?? false,
      imageUrl: initialData?.imageUrl || '',
      slug: initialData?.slug || '',
    },
  });

  const watchedValues = useWatch({ control }) as Partial<ProductFormValues>;

  const onSubmit: SubmitHandler<ProductFormValues> = (data) => {
    const payload = {
      ...data,
      categoryId: data.categoryId || 1, 
    };

    if (initialData) {
      updateMutation.mutate(payload as any, {
        onSuccess: () => {
          toast.success('Product updated successfully');
          router.push('/admin/products');
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to update product');
        },
      });
    } else {
      createMutation.mutate(payload as any, {
        onSuccess: () => {
          toast.success('Product created successfully');
          router.push('/admin/products');
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to create product');
        },
      });
    }
  };

  return (
    <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-12 pb-32">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md py-4 border-b border-neutral-100 mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tighter uppercase">
          {initialData ? 'Edit Product' : 'Create New Product'}
        </h1>
        <div className="flex gap-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-[10px] font-bold tracking-widest uppercase"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending}
            className="bg-black text-white px-8 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-neutral-800 transition-all shadow-xl shadow-black/10"
          >
            {initialData ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Left Column: Core Info & Media (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          {/* Basic Information Section */}
          <section className="bg-surface-container-lowest p-10 rounded-xl space-y-8 border border-neutral-100">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight">
                {initialData ? 'Update Narrative Identity' : 'Core Details'}
              </h2>
              <p className="text-sm text-neutral-500">Provide the fundamental identity of the item.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Product Name</label>
                <input 
                  {...register('name')}
                  className={cn(
                    "w-full bg-surface-container-low border-none rounded-md px-4 py-4 text-lg focus:ring-1 focus:ring-black placeholder:text-neutral-300 transition-all",
                    errors.name && "ring-1 ring-error"
                  )}
                  placeholder="e.g. Minimalist Linen Overshirt" 
                  type="text"
                />
                {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Description</label>
                <div className="bg-surface-container-low rounded-md overflow-hidden border border-transparent focus-within:border-neutral-200 transition-all">
                  <div className="flex items-center gap-4 px-4 py-2 border-b border-neutral-100 bg-white/50">
                    <span className="material-symbols-outlined text-sm text-neutral-400">format_bold</span>
                    <span className="material-symbols-outlined text-sm text-neutral-400">format_italic</span>
                    <span className="material-symbols-outlined text-sm text-neutral-400">list</span>
                    <span className="material-symbols-outlined text-sm text-neutral-400">link</span>
                  </div>
                  <textarea 
                    {...register('description')}
                    className="w-full bg-transparent border-none focus:ring-0 p-4 text-sm resize-none" 
                    placeholder="Describe the material, fit, and curation story..." 
                    rows={8}
                  ></textarea>
                </div>
              </div>
            </div>
          </section>

          {/* Media Section */}
          <section className="bg-surface-container-lowest p-10 rounded-xl space-y-8 border border-neutral-100">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight">Product Imagery</h2>
              <p className="text-sm text-neutral-500">Provide a high-resolution editorial photography URL.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Image URL</label>
                <input 
                  {...register('imageUrl')}
                  className={cn(
                    "w-full bg-surface-container-low border-none rounded-md px-4 py-4 text-sm focus:ring-1 focus:ring-black placeholder:text-neutral-300 transition-all",
                    errors.imageUrl && "ring-1 ring-error"
                  )}
                  placeholder="https://images.unsplash.com/..." 
                  type="text"
                />
                {errors.imageUrl && <p className="text-xs text-error mt-1">{errors.imageUrl.message}</p>}
              </div>

              <div className="grid grid-cols-4 gap-4">
                {/* Image Preview Slot */}
                <div className="col-span-2 aspect-[4/5] border-2 border-dashed border-neutral-200 rounded-lg flex flex-col items-center justify-center bg-surface-container-low relative overflow-hidden group">
                  {watchedValues.imageUrl ? (
                    <img 
                      src={watchedValues.imageUrl} 
                      alt="Preview" 
                      className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl text-neutral-300 group-hover:text-black transition-colors mb-4">image</span>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Image Preview</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Options (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Logistics Section */}
          <section className="bg-surface-container-lowest p-8 rounded-xl space-y-8 border border-neutral-100">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold tracking-tight">Logistics</h2>
                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Active</span>
                    <button 
                      type="button"
                      onClick={() => setValue('isActive', !watchedValues.isActive)}
                      className={cn(
                        "w-10 h-5 rounded-full relative transition-colors duration-200",
                        watchedValues.isActive ? "bg-black" : "bg-neutral-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200",
                        watchedValues.isActive ? "right-0.5" : "left-0.5"
                      )} />
                    </button>
                    <input type="hidden" {...register('isActive')} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Featured</span>
                    <button 
                      type="button"
                      onClick={() => setValue('isFeatured', !watchedValues.isFeatured)}
                      className={cn(
                        "w-10 h-5 rounded-full relative transition-colors duration-200",
                        watchedValues.isFeatured ? "bg-black" : "bg-neutral-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200",
                        watchedValues.isFeatured ? "right-0.5" : "left-0.5"
                      )} />
                    </button>
                    <input type="hidden" {...register('isFeatured')} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Category</label>
                <select 
                  {...register('categoryId')}
                  className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-black appearance-none cursor-pointer"
                >
                  <option value={1}>Outerwear</option>
                  <option value={2}>Tailoring</option>
                  <option value={3}>Bottoms</option>
                  <option value={4}>Knitwear</option>
                  <option value={5}>Accessories</option>
                  <option value={6}>Ready-to-Wear</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Price (USD)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-neutral-400 text-sm">$</span>
                    <input 
                      {...register('price')}
                      className="w-full bg-surface-container-low border-none rounded-md pl-8 pr-4 py-3 text-sm focus:ring-1 focus:ring-black" 
                      placeholder="0.00" 
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Stock</label>
                  <input 
                    {...register('stockQuantity')}
                    className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-black" 
                    placeholder="0" 
                    type="number"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Store Preview Card */}
          <div className="bg-black p-10 rounded-xl text-white space-y-6 overflow-hidden relative group cursor-default shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <span className="material-symbols-outlined text-6xl">visibility</span>
            </div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">Store Preview</p>
            <div className="space-y-4 relative z-10">
              <div className="aspect-[4/5] bg-neutral-800 rounded-md mb-6 overflow-hidden relative">
                {watchedValues.imageUrl ? (
                  <img 
                    src={watchedValues.imageUrl} 
                    alt="Preview" 
                    className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                     <span className="material-symbols-outlined text-neutral-600 text-4xl">image</span>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold tracking-tighter leading-tight">
                {watchedValues.name || 'Product Narrative Name'}
              </h3>
              <div className="flex justify-between items-baseline">
                <span className="text-sm opacity-60">
                   {watchedValues.categoryId == 1 ? 'Outerwear' : 
                    watchedValues.categoryId == 2 ? 'Tailoring' :
                    watchedValues.categoryId == 3 ? 'Bottoms' :
                    watchedValues.categoryId == 4 ? 'Knitwear' : 
                    watchedValues.categoryId == 5 ? 'Accessories' : 'Ready-to-Wear'}
                </span>
                <span className="text-xl font-medium">
                  ${Number(watchedValues.price || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <p className="text-[10px] text-neutral-400 italic text-center">
              Ensure all editorial information is accurate before publishing to the catalog.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
