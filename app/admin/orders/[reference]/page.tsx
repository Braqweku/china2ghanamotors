import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { getOrder, getOrderTrackingEvents } from "@/lib/data/orders";
import { whatsappNumber } from "@/lib/order-query";
import { TrackingTimeline } from "@/components/tracking/tracking-timeline";
import { AddEventForm } from "@/components/admin/add-event-form";
import { StageStatus } from "@/components/admin/stage-status";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const contactLink =
  "inline-flex items-center gap-2 text-small text-foreground underline-offset-4 hover:underline";

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
  const wa = whatsappNumber(order.customerPhone);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-small text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All orders
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="font-mono text-h2 font-semibold text-foreground">{order.reference}</h1>
        <StageStatus stage={order.currentStage} className="text-small" />
      </div>
      <p className="mt-1 text-small text-muted-foreground">
        {order.source === "sourcing" ? "Sourcing request" : "Fleet request"} · Submitted{" "}
        {formatDate(order.createdAt)} · Updated {formatDate(order.updatedAt)}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <section aria-labelledby="timeline-heading" className="min-w-0">
          <h2 id="timeline-heading" className="text-h3 font-semibold text-foreground">
            Timeline
          </h2>
          <div className="mt-4">
            {events.length > 0 ? (
              <TrackingTimeline events={events} />
            ) : (
              <p className="text-small text-muted-foreground">No updates recorded yet.</p>
            )}
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section aria-labelledby="customer-heading" className="rounded-lg border border-border bg-card p-5">
            <h2 id="customer-heading" className="text-small font-semibold text-foreground">
              Customer
            </h2>
            <p className="mt-3 text-body font-medium text-foreground">{order.customerName}</p>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <a href={`tel:${order.customerPhone.replace(/\s/g, "")}`} className={contactLink}>
                  <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {order.customerPhone}
                </a>
              </li>
              {wa && (
                <li>
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className={contactLink}>
                    <MessageCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    WhatsApp
                  </a>
                </li>
              )}
              {order.customerEmail && (
                <li>
                  <a href={`mailto:${order.customerEmail}`} className={contactLink}>
                    <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    {order.customerEmail}
                  </a>
                </li>
              )}
            </ul>
          </section>

          <section aria-labelledby="request-heading" className="rounded-lg border border-border bg-card p-5">
            <h2 id="request-heading" className="text-small font-semibold text-foreground">
              Request
            </h2>
            <p className="mt-3 whitespace-pre-line text-small text-foreground">{order.summary}</p>
          </section>

          <section aria-labelledby="update-heading" className="rounded-lg border border-border bg-card p-5">
            <h2 id="update-heading" className="text-small font-semibold text-foreground">
              Update status
            </h2>
            <div className="mt-4">
              <AddEventForm reference={order.reference} currentStage={order.currentStage} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
