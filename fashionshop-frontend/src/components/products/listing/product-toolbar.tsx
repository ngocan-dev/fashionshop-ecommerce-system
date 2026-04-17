import { ChevronDown, Search } from 'lucide-react';
import type { ProductSortOption } from './types';

type ProductToolbarProps = {
  searchTerm: string;
  resultCount: number;
  sortBy: ProductSortOption;
  onSearchChange: (value: string) => void;
  onSortChange: (value: ProductSortOption) => void;
};

const sortOptions: ProductSortOption[] = ['Newest Arrivals', 'Price: Low to High', 'Price: High to Low', 'Category'];

export function ProductToolbar({ searchTerm, resultCount, sortBy, onSearchChange, onSortChange }: ProductToolbarProps) {
  return (
    <div className="space-y-6">
      <label className="relative block">
        <span className="sr-only">Search products</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-300" />
        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products..."
          className="h-16 w-full border border-zinc-200 bg-white pl-12 pr-4 text-sm tracking-[0.16em] text-zinc-900 outline-none transition placeholder:uppercase placeholder:tracking-[0.24em] placeholder:text-zinc-300 focus:border-zinc-400"
          aria-label="Search products"
        />
      </label>

      <div className="flex flex-col gap-3 border-b border-zinc-200 pb-5 md:flex-row md:items-center md:justify-between">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-zinc-400">{resultCount} Results Found</p>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-zinc-500">Sort By:</span>
          <label className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value as ProductSortOption)}
              className="appearance-none bg-transparent py-1.5 pl-0 pr-8 text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-zinc-900 outline-none"
              aria-label="Sort products"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-zinc-400" />
          </label>
        </div>
      </div>
    </div>
  );
}