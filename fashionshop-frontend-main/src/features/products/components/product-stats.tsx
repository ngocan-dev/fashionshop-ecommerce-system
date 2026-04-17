'use client';

import { cn } from "@/lib/utils/cn";

type Props = {
  totalItems: number;
  outOfStock: number;
  active: number;
};

export function ProductStats({ totalItems, outOfStock, active }: Props) {
  return (
    <div className="grid grid-cols-12 gap-6 mb-12">
      
      <div className="col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-xl">
        <p className="font-label text-[10px] tracking-widest uppercase text-neutral-500 mb-1">
          Total Items
        </p>
        <p className="font-headline text-3xl font-bold tracking-tighter">
          {totalItems.toLocaleString()}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          <span>All listings covered</span>
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-xl">
        <p className="font-label text-[10px] tracking-widest uppercase text-neutral-500 mb-1">
          Out of Stock
        </p>
        <p className={cn(
          "font-headline text-3xl font-bold tracking-tighter",
          outOfStock > 0 && "text-error"
        )}>
          {outOfStock}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
          <span>Current page items</span>
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 bg-primary text-on-primary p-8 rounded-xl">
        <p className="font-label text-[10px] tracking-widest uppercase text-neutral-200/60 mb-1">
          Active Listings
        </p>
        <p className="font-headline text-3xl font-bold tracking-tighter">
          {active}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-neutral-300">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>Synchronized across channels</span>
        </div>
      </div>

    </div>
  );
}