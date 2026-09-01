import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "15+", label: "Verified suppliers" },
  { value: "500+", label: "Vehicles sourced" },
  { value: "100%", label: "Inspected before shipping" },
];

export function Hero() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-24">
        <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700">
          <p className="text-label font-medium uppercase tracking-wide text-accent">
            China to Ghana. Driven by trust.
          </p>
          <h1 className="mt-4 text-h1 font-semibold tracking-tight text-foreground lg:text-display">
            Your next vehicle, sourced from China, delivered in Ghana.
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted-foreground">
            We source, verify, ship and clear vehicles from trusted suppliers
            in China — giving you a clearer, safer and more convenient route
            to your next vehicle.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/source">Source My Vehicle</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/vehicles">Explore Vehicles</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-h3 font-semibold text-foreground">
                  {stat.value}
                </p>
                <p className="text-small text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative animate-in fade-in slide-in-from-right-6 fill-mode-both duration-700 delay-150">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-muted shadow-lg">
            <Image
              src="/vehicles/veh_001/veh_001_angle_03.jpg"
              alt="BYD Song Plus SUV, one of the vehicles sourced by China2Ghana Motors"
              fill
              sizes="(min-width: 1024px) 448px, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
