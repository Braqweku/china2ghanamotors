import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder, getOrderTrackingEvents } from "@/lib/data/orders";
import { TrackingTimeline } from "@/components/tracking/tracking-timeline";
import { AddEventForm } from "@/components/admin/add-event-form";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const order = await getOrder(reference);

  if (!order) {
    notFound();
  }

  const events = await getOrderTrackingEvents(reference);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/admin/orders" className="text-small text-muted-foreground hover:text-foreground">
        ← All orders
      </Link>

      <h1 className="mt-2 font-mono text-h1 font-semibold text-foreground">{order.reference}</h1>
      <p className="mt-2 text-body text-foreground">
        {order.customerName} · {order.customerPhone}
        {order.customerEmail ? ` · ${order.customerEmail}` : ""}
      </p>
      <p className="mt-1 text-body text-muted-foreground">{order.summary}</p>
      <p className="mt-1 text-small text-muted-foreground">
        {order.source === "sourcing" ? "Source My Vehicle" : "Fleet & Corporate"} request ·
        Submitted{" "}
        {new Date(order.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <section>
          <h2 className="text-h3 font-semibold text-foreground">Timeline</h2>
          <div className="mt-4">
            <TrackingTimeline events={events} />
          </div>
        </section>
        <section>
          <h2 className="text-h3 font-semibold text-foreground">Update status</h2>
          <div className="mt-4">
            <AddEventForm reference={order.reference} currentStage={order.currentStage} />
          </div>
        </section>
      </div>
    </div>
  );
}
