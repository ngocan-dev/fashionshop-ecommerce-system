import { cn } from '@/lib/utils/cn';

export type ColorOption = {
  id: string;
  label: string;
  swatch: string;
};

type ColorFilterProps = {
  colors: ColorOption[];
  selectedColor: string;
  onChange: (colorId: string) => void;
};

export function ColorFilter({ colors, selectedColor, onChange }: ColorFilterProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-800">Color</h3>
      <div className="flex flex-wrap items-center gap-3">
        {colors.map((color) => {
          const active = color.id === selectedColor;
          return (
            <button
              key={color.id}
              type="button"
              aria-label={color.label}
              title={color.label}
              onClick={() => onChange(color.id)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
                active ? 'border-zinc-900' : 'border-transparent hover:border-zinc-400',
              )}
            >
              <span className="h-6 w-6 rounded-full border border-zinc-300" style={{ backgroundColor: color.swatch }} />
            </button>
          );
        })}
      </div>
    </section>
  );
}
