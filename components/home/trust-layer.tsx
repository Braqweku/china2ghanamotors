"use client";

import { Compass, ShieldCheck, Ship, PackageCheck } from "lucide-react";
import { useRevealOnScroll } from "@/lib/hooks/use-reveal-on-scroll";
import { cn } from "@/lib/utils";

const stages = [
  {
    icon: Compass,
    title: "Source",
    copy: "We identify the right vehicle from verified suppliers in China, based on your specifications and budget.",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    copy: "Every vehicle is inspected and its condition confirmed before you approve the purchase.",
  },
  {
    icon: Ship,
    title: "Ship",
    copy: "We coordinate shipping and handle customs and clearing, so the process is never on you alone.",
  },
  {
    icon: PackageCheck,
    title: "Deliver",
    copy: "Your vehicle is delivered to you in Ghana, with updates and documentation the whole way.",
  },
];

function TrustCard({ icon: Icon, title, copy }: (typeof stages)[number]) {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-[var(--motion-base)] ease-[var(--motion-ease)]",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <Icon className="h-8 w-8 text-accent" aria-hidden="true" />
      <h3 className="mt-4 text-h3 font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-small text-muted-foreground">{copy}</p>
    </div>
  );
}

export function TrustLayer() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((stage) => (
          <TrustCard key={stage.title} {...stage} />
        ))}
      </div>
    </section>
  );
}
