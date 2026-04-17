import { cn } from '@/lib/utils/cn';
import type { ProductCategory } from './types';

type ProductFiltersProps = {
  selectedCategory: string;
  selectedSize: string;
  selectedColor: string;
  priceRange: number;
  onCategoryChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onPriceChange: (value: number) => void;
  categories?: string[];
};

const defaultCategoryOptions = ['All Products', 'Outerwear', 'Tailoring', 'Knitwear', 'Accessories'];
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
const colorOptions = [
  { id: 'black', label: 'Black', swatch: '#0b0b0c' },
  { id: 'light-gray', label: 'Light Gray', swatch: '#e4e4e2' },
  { id: 'gray', label: 'Gray', swatch: '#8b8d93' },
  { id: 'off-white', label: 'Off White', swatch: '#f3efe7' },
  { id: 'dark-brown', label: 'Dark Brown', swatch: '#2f2a27' },
];

export function ProductFilters({
  selectedCategory,
  selectedSize,
  selectedColor,
  priceRange,
  onCategoryChange,
  onSizeChange,
  onColorChange,
  onPriceChange,
  categories,
}: ProductFiltersProps) {
  const categoryOptions = categories ? ['All Products', ...categories] : defaultCategoryOptions;
  return (
    <aside className="w-full border-b border-zinc-200 pb-8 lg:w-[250px] lg:border-b-0 lg:pb-0">
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-zinc-900">Category</h2>
          <div className="space-y-3">
            {categoryOptions.map((option) => {
              const active = option === selectedCategory;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onCategoryChange(option)}
                  className={cn(
                    'block text-left text-[0.95rem] font-semibold uppercase tracking-[0.08em] transition-colors',
                    active ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-800',
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-zinc-900">Size</h2>
          <div className="grid grid-cols-3 gap-2">
            {sizeOptions.map((size) => {
              const active = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange(active ? '' : size)}
                  className={cn(
                    'h-10 border text-xs font-semibold uppercase tracking-[0.18em] transition-colors',
                    active ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900',
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-zinc-900">Color</h2>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => {
              const active = selectedColor === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  title={color.label}
                  aria-label={color.label}
                  aria-pressed={active}
                  onClick={() => onColorChange(active ? '' : color.id)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border transition-transform duration-200 hover:-translate-y-0.5',
                    active ? 'border-zinc-900 ring-1 ring-zinc-900/20' : 'border-zinc-300',
                  )}
                >
                  <span className="h-6 w-6 rounded-full border border-zinc-200" style={{ backgroundColor: color.swatch }} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-zinc-900">Price Range</h2>
          <input
            type="range"
            min={0}
            max={2000}
            value={priceRange}
            onChange={(event) => onPriceChange(Number(event.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-zinc-900"
            aria-label="Price range"
          />
          <div className="flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            <span>$0</span>
            <span>$2,000+</span>
          </div>
        </section>
      </div>
    </aside>
  );
}