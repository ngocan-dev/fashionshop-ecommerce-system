import { cn } from '@/lib/utils/cn';

export type CategoryOption = {
  id: string;
  label: string;
};

type CategoryFilterProps = {
  options: CategoryOption[];
  selectedCategory: string;
  onChange: (categoryId: string) => void;
};

export function CategoryFilter({ options, selectedCategory, onChange }: CategoryFilterProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-800">Category</h3>
      <ul className="space-y-3">
        {options.map((option) => {
          const active = option.id === selectedCategory;
          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => onChange(option.id)}
                className={cn(
                  'text-left text-[1.05rem] font-medium uppercase tracking-[0.03em] transition-colors',
                  active ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700',
                )}
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
