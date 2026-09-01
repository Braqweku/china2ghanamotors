"use client";

import { Compass, ShieldCheck, Ship, PackageCheck, type LucideIcon } from "lucide-react";
import { useRevealOnScroll } from "@/lib/hooks/use-reveal-on-scroll";
import { cn } from "@/lib/utils";

type Phase = {
  icon: LucideIcon;
  label: string;
  steps: string[];
};

const phases: Phase[] = [
  {
    icon: Compass,
    label: "Source",
    steps: [
      "Customer Request",
      "Vehicle Options Sourced in China",
      "Price & Specifications Shared",
    ],
  },
  {
    icon: ShieldCheck,
    label: "Verify",
    steps: ["Inspection / Verification", "Customer Approval & Payment"],
  },
  {
    icon: Ship,
    label: "Ship",
    steps: ["Shipping to Ghana", "Clearing & Documentation"],
  },
  {
    icon: PackageCheck,
    label: "Deliver",
    steps: ["Vehicle Delivery"],
  },
];

function PhaseColumn({ icon: Icon, label, steps }: Phase) {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        "border-t-2 border-accent pt-4 transition-all duration-[var(--motion-base)] ease-[var(--motion-ease)]",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
      <h3 className="mt-2 text-h3 font-semibold text-foreground">{label}</h3>
      <ul className="mt-2 space-y-1">
        {steps.map((step) => (
          <li key={step} className="text-small text-muted-foreground">
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Journey() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-h2 font-semibold text-foreground">How it works</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((phase) => (
          <PhaseColumn key={phase.label} {...phase} />
        ))}
      </div>
    </section>
  );
}
