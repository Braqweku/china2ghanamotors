import { Suspense } from "react";
import Link from "next/link";
import { listOrders } from "@/lib/data/orders";
import { filterOrders, orderStats } from "@/lib/order-query";
import { stageOrder } from "@/lib/tracking-stages";
import { OrderFilters } from "@/components/admin/order-filters";
import { StageStatus } from "@/components/admin/stage-status";
import type { OrderSource, TrackingStage } from "@/types";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const sourceLabel: Record<OrderSource, string> = { sourcing: "Sourcing", fleet: "Fleet" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const stageParam = first(params.stage);
  const sourceParam = first(params.source);
  const allOrders = await listOrders();
  const orders = filterOrders(allOrders, {
    q: first(params.q),
    stage: stageOrder.includes(stageParam as TrackingStage) ? (stageParam as TrackingStage) : undefined,
    source: sourceParam === "sourcing" || sourceParam === "fleet" ? sourceParam : undefined,
  });
  const stats = orderStats(allOrders);
  const isFiltered = orders.length !== allOrders.length;

  const summary = [
    { label: "Total", value: stats.total },
    { label: "In progress", value: stats.inProgress },
    { label: "Shipping", value: stats.shipping },
    { label: "Delivered", value: stats.delivered },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-h2 font-semibold text-foreground">Orders</h1>

      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
        {summary.map((s) => (
          <div key={s.label} className="flex items-baseline gap-2">
            <dt className="text-small text-muted-foreground">{s.label}</dt>
            <dd className="order-first text-h3 font-semibold tabular-nums text-foreground">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <Suspense>
          <OrderFilters />
        </Suspense>
      </div>

      {isFiltered && (
        <p className="mt-4 text-small text-muted-foreground" aria-live="polite">
          Showing {orders.length} of {allOrders.length} orders ·{" "}
          <Link href="/admin/orders" className="font-medium text-foreground underline underline-offset-4">
            Clear
          </Link>
        </p>
      )}

      <div className="mt-4 rounded-lg border border-border bg-card">
        {orders.length === 0 ? (
          <p className="p-10 text-center text-body text-muted-foreground">
            {allOrders.length === 0
              ? "No orders yet. They'll appear here as customers submit sourcing and fleet requests."
              : "No orders match these filters."}
          </p>
        ) : (
          <>
            <table className="hidden w-full text-left text-small md:table">
              <thead className="border-b border-border text-caption font-medium text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Reference</th>
                  <th scope="col" className="px-4 py-3 font-medium">Customer</th>
                  <th scope="col" className="px-4 py-3 font-medium">Request</th>
                  <th scope="col" className="px-4 py-3 font-medium">Stage</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.reference} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.reference}`}
                        className="font-mono font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        {order.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-foreground">{order.customerName}</td>
                    <td className="max-w-xs px-4 py-3">
                      <p className="truncate text-foreground">{order.summary}</p>
                      <p className="text-caption text-muted-foreground">{sourceLabel[order.source]}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StageStatus stage={order.currentStage} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {formatDate(order.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="divide-y divide-border md:hidden">
              {orders.map((order) => (
                <li key={order.reference}>
                  <Link href={`/admin/orders/${order.reference}`} className="block p-4 hover:bg-muted/40">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-small font-medium text-foreground">{order.reference}</span>
                      <span className="text-caption text-muted-foreground">{formatDate(order.updatedAt)}</span>
                    </div>
                    <p className="mt-1 text-small text-foreground">{order.customerName}</p>
                    <p className="truncate text-small text-muted-foreground">
                      {sourceLabel[order.source]} · {order.summary}
                    </p>
                    <StageStatus stage={order.currentStage} className="mt-2 text-small" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
