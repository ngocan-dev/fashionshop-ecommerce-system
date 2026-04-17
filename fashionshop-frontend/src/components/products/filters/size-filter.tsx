import { cn } from '@/lib/utils/cn';

type SizeFilterProps = {
  sizes: string[];
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
};

export function SizeFilter({ sizes, selectedSizes, onToggleSize }: SizeFilterProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-800">Size</h3>
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((size) => {
          const active = selectedSizes.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => onToggleSize(size)}
              className={cn(
                'h-10 rounded-md text-sm font-semibold uppercase tracking-[0.08em] transition-colors',
                active ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700',
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </section>
  );
}
