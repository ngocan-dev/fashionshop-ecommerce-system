import { cn } from "@/lib/utils/cn";

type Props = {
  categoryId: number | null;
  onCategoryChange: (id: number | null) => void;
  searchTerm: string;
  onSearch: (value: string) => void;
};

const CATEGORY_TABS = [
  { label: "All", value: null },
  { label: "Outerwear", value: 1 },
  { label: "Tailoring", value: 2 },
  { label: "Bottoms", value: 3 },
  { label: "Knitwear", value: 4 },
  { label: "Accessories", value: 5 },
  { label: "Ready-to-Wear", value: 6 },
];

export function AdminProductsFilters({
  categoryId,
  onCategoryChange,
  searchTerm,
  onSearch,
}: Props) {
  return (
    <div className="grid grid-cols-12 gap-6 mb-8">
      {/* Category Tabs */}
      <div className="col-span-12 lg:col-span-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => onCategoryChange(tab.value)}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all",
              categoryId === tab.value
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="col-span-12 lg:col-span-4 flex items-center gap-3">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
            search
          </span>
          <input
            className="w-full bg-white border border-neutral-200 rounded-lg py-2 pl-10 pr-4 text-xs font-body focus:ring-1 focus:ring-black outline-none transition-all"
            placeholder="Search by name, SKU or category..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
