import { ArrowRight } from "lucide-react";

const steps = [
  "Customer Request",
  "Vehicle Options Sourced",
  "Price & Specifications Shared",
  "Inspection / Verification",
  "Customer Approval & Payment",
  "Shipping to Ghana",
  "Clearing & Documentation",
  "Vehicle Delivery",
];

export function Journey() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-h2 font-semibold text-foreground">How it works</h2>
      <p className="mt-2 max-w-2xl text-body text-muted-foreground">
        From request to delivery, here&apos;s the path every vehicle takes.
      </p>
      <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-2">
            <span className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-caption font-medium text-primary-foreground">
                {i + 1}
              </span>
              <span className="text-small whitespace-nowrap text-foreground">{step}</span>
            </span>
            {i < steps.length - 1 && (
              <ArrowRight
                className="h-4 w-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
