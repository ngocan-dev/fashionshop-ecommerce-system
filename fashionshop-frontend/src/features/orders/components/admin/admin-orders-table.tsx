"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { Order } from "@/types/order";

type Props = {
  orders: Order[];
  isLoading: boolean;
};

// ── Status Badge Config ──────────────────────────────────────────────────────

const PAYMENT_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  PAID: { label: "Paid", className: "bg-emerald-50 text-emerald-700" },
  PENDING: { label: "Pending", className: "bg-neutral-100 text-neutral-600" },
  FAILED: { label: "Failed", className: "bg-red-50 text-red-700" },
  REFUNDED: { label: "Refunded", className: "bg-amber-50 text-amber-700" },
};

const FULFILLMENT_STATUS_CONFIG: Record<
  string,
  { label: string; className: string; strikethrough?: boolean }
> = {
  PENDING: {
    label: "Unfulfilled",
    className: "bg-neutral-100 text-neutral-600",
  },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-50 text-blue-700" },
  PROCESSING: { label: "Processing", className: "bg-amber-50 text-amber-700" },
  SHIPPED: { label: "Shipped", className: "bg-blue-50 text-blue-700" },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-neutral-100 text-neutral-400",
    strikethrough: true,
  },
};

export function AdminOrdersTable({ orders, isLoading }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-neutral-100">
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Order ID
            </th>
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Customer
            </th>
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Date
            </th>
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Total
            </th>
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Payment
            </th>
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Fulfillment
            </th>
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {isLoading ? (
            // Loading skeleton rows
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-8 py-6">
                  <div className="h-4 w-16 bg-neutral-100 rounded" />
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100" />
                    <div className="space-y-1">
                      <div className="h-3 w-24 bg-neutral-100 rounded" />
                      <div className="h-2.5 w-32 bg-neutral-100 rounded" />
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="h-4 w-24 bg-neutral-100 rounded" />
                </td>
                <td className="px-8 py-6">
                  <div className="h-4 w-16 bg-neutral-100 rounded" />
                </td>
                <td className="px-8 py-6">
                  <div className="h-6 w-14 bg-neutral-100 rounded-md" />
                </td>
                <td className="px-8 py-6">
                  <div className="h-6 w-20 bg-neutral-100 rounded-md" />
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="h-4 w-20 bg-neutral-100 rounded ml-auto" />
                </td>
              </tr>
            ))
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-8 py-20 text-center">
                <span className="material-symbols-outlined text-4xl text-neutral-300 block mb-3">
                  shopping_bag
                </span>
                <p className="text-sm font-semibold text-neutral-500">
                  No orders found
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Try adjusting your search or filters
                </p>
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const paymentKey = order.paymentStatus ?? "PENDING";
              const payment =
                PAYMENT_STATUS_CONFIG[paymentKey] ??
                PAYMENT_STATUS_CONFIG.PENDING;
              const fulfillment = FULFILLMENT_STATUS_CONFIG[order.status];

              // Customer display — API doesn't return name/email, fall back to order info
              const displayName =
                order.customerName ??
                `Order ${order.orderNumber ?? order.id.slice(-6).toUpperCase()}`;
              const displayEmail =
                order.customerEmail ?? order.paymentMethod ?? "—";
              const initials = order.customerName
                ? order.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : (order.orderNumber ?? order.id).slice(-2).toUpperCase();

              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—";

              return (
                <tr
                  key={order.id}
                  className="hover:bg-surface-container-low/50 transition-colors group"
                >
                  {/* Order ID */}
                  <td className="px-8 py-6 font-bold text-sm">
                    #{order.orderNumber ?? order.id.slice(-6).toUpperCase()}
                  </td>

                  {/* Customer */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-neutral-400 truncate">
                          {displayEmail}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-8 py-6 text-sm text-neutral-600 whitespace-nowrap">
                    {formattedDate}
                  </td>

                  {/* Total */}
                  <td className="px-8 py-6 font-bold text-sm whitespace-nowrap">
                    $
                    {order.total.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  {/* Payment Status */}
                  <td className="px-8 py-6">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                        payment.className,
                      )}
                    >
                      {payment.label}
                    </span>
                  </td>

                  {/* Fulfillment Status */}
                  <td className="px-8 py-6">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                        fulfillment.className,
                        fulfillment.strikethrough && "line-through",
                      )}
                    >
                      {fulfillment.label}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-8 py-6 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs font-bold uppercase tracking-widest text-primary hover:underline underline-offset-4 transition-all"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
