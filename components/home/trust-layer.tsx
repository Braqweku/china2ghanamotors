"use client";

import { useTranslations } from "next-intl";
import { Compass, ShieldCheck, Ship, PackageCheck } from "lucide-react";
import { useRevealOnScroll } from "@/lib/hooks/use-reveal-on-scroll";
import { cn } from "@/lib/utils";

const stages = [
  { icon: Compass, key: "source" },
  { icon: ShieldCheck, key: "verify" },
  { icon: Ship, key: "ship" },
  { icon: PackageCheck, key: "deliver" },
] as const;

function TrustCard({ icon: Icon, title, copy }: { icon: (typeof stages)[number]["icon"]; title: string; copy: string }) {
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
  const t = useTranslations("home.trust");

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((stage) => (
          <TrustCard
            key={stage.key}
            icon={stage.icon}
            title={t(`${stage.key}Title`)}
            copy={t(`${stage.key}Copy`)}
          />
        ))}
      </div>
    </section>
  );
}
