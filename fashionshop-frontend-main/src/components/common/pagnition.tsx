'use client';

import { cn } from '@/lib/utils/cn';

type Props = {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-6 border-t border-neutral-100 flex items-center justify-between">
      <p className="text-xs text-neutral-500 font-body">
        Showing{' '}
        <span className="font-bold text-black">
          {Math.min((page - 1) * pageSize + 1, totalItems)} -{' '}
          {Math.min(page * pageSize, totalItems)}
        </span>{' '}
        of <span className="font-bold text-black">{totalItems}</span> items
      </p>

      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 text-neutral-400 hover:bg-neutral-50 disabled:opacity-30 transition-all"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all",
              page === i + 1
                ? "bg-primary text-white"
                : "border border-neutral-200 hover:bg-neutral-50"
            )}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 text-neutral-400 hover:bg-neutral-50 disabled:opacity-30 transition-all"
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>
  );
}