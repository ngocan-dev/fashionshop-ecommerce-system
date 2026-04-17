import { cn } from "@/lib/utils/cn";
import type { OrderStatus } from "@/types/order";

type Props = {
  statusFilter: OrderStatus | '';
  onStatusChange: (status: OrderStatus | '') => void;
  searchTerm: string;
  onSearch: (value: string) => void;
};

// ── Status Filter Tabs ──────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: OrderStatus | "" }[] = [
  { label: "All Orders", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function AdminOrdersFilters({
  statusFilter,
  onStatusChange,
  searchTerm,
  onSearch,
}: Props) {
  return (
    <div className="grid grid-cols-12 gap-6 mb-8">
      {/* Tabs */}
      <div className="col-span-12 lg:col-span-8 flex gap-2 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatusChange(tab.value)}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all",
              statusFilter === tab.value
                ? "bg-primary text-white"
                : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="col-span-12 lg:col-span-4 flex items-center gap-3">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
            search
          </span>
          <input
            className="w-full bg-surface-container-lowest border border-outline/10 rounded-md py-2 pl-10 pr-4 text-xs font-label focus:ring-1 focus:ring-primary transition-all"
            placeholder="Search order ID or customer..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}