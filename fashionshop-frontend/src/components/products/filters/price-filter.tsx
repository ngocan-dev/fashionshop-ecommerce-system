type PriceFilterProps = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

function formatMoney(value: number) {
  return `$${value.toLocaleString()}`;
}

export function PriceFilter({ min, max, value, onChange }: PriceFilterProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-800">Price Range</h3>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-zinc-900"
        aria-label="Filter by price range"
      />

      <div className="flex items-center justify-between text-sm font-semibold tracking-[0.1em] text-zinc-500">
        <span>{formatMoney(min)}</span>
        <span>{formatMoney(max)}+</span>
      </div>
    </section>
  );
}
