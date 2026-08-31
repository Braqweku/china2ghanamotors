"use client";

import { useRevealOnScroll } from "@/lib/hooks/use-reveal-on-scroll";
import { cn } from "@/lib/utils";

const steps = [
  "Customer Request",
  "Vehicle Options Sourced in China",
  "Price & Specifications Shared",
  "Inspection / Verification",
  "Customer Approval & Payment",
  "Shipping to Ghana",
  "Clearing & Documentation",
  "Vehicle Delivery",
];

function JourneyStep({ label, index }: { label: string; index: number }) {
  const { ref, isVisible } = useRevealOnScroll<HTMLLIElement>();
  return (
    <li
      ref={ref}
      className={cn(
        "relative flex gap-4 pb-10 last:pb-0 transition-all duration-[var(--motion-base)] ease-[var(--motion-ease)]",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-label font-medium text-primary-foreground">
        {index + 1}
      </span>
      <span className="pt-1 text-body text-foreground">{label}</span>
    </li>
  );
}

export function Journey() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="text-h2 font-semibold text-foreground">How it works</h2>
      <ol className="relative mt-10 border-l border-border pl-8">
        {steps.map((label, index) => (
          <JourneyStep key={label} label={label} index={index} />
        ))}
      </ol>
    </section>
  );
}
