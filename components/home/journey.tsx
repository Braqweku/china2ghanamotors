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

function PhaseGroup({ icon: Icon, label, steps, isLast }: Phase & { isLast: boolean }) {
  const { ref, isVisible } = useRevealOnScroll<HTMLLIElement>();
  return (
    <li
      ref={ref}
      className={cn(
        "relative flex gap-4 pb-10 last:pb-0 transition-all duration-[var(--motion-base)] ease-[var(--motion-ease)]",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      {!isLast && (
        <span className="absolute top-10 left-5 h-[calc(100%-2.5rem)] w-px bg-border" />
      )}
      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
        <Icon className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
      </span>
      <div className="flex-1 pt-1.5">
        <h3 className="text-h3 font-semibold text-foreground">{label}</h3>
        <ul className="mt-3 space-y-2">
          {steps.map((step) => (
            <li key={step} className="flex items-center gap-2 text-body text-muted-foreground">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {step}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function Journey() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="text-h2 font-semibold text-foreground">How it works</h2>
      <ol className="mt-10">
        {phases.map((phase, index) => (
          <PhaseGroup key={phase.label} {...phase} isLast={index === phases.length - 1} />
        ))}
      </ol>
    </section>
  );
}
