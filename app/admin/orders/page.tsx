import Link from "next/link";
import { listOrders } from "@/lib/data/orders";
import { stageLabels } from "@/lib/tracking-stages";
import { LogoutButton } from "@/components/admin/logout-button";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-semibold text-foreground">Orders</h1>
          <p className="mt-1 text-body text-muted-foreground">
            {orders.length} order{orders.length === 1 ? "" : "s"}
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-body text-muted-foreground">
            No orders yet. They&apos;ll appear here as customers submit sourcing
            and fleet requests.
          </p>
        ) : (
          <table className="w-full text-left text-small">
            <thead className="border-b border-border bg-muted/50 text-caption font-medium tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Summary</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.reference}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.reference}`}
                      className="font-mono text-accent hover:underline"
                    >
                      {order.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground">{order.customerName}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                    {order.summary}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {stageLabels[order.currentStage]}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(order.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
