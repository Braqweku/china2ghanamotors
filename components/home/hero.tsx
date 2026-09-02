import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSlideshow } from "@/components/home/hero-slideshow";

const stats = [
  { value: "15+", label: "Verified suppliers" },
  { value: "500+", label: "Vehicles sourced" },
  { value: "100%", label: "Inspected before shipping" },
];

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-primary">
      <div className="relative h-[70svh] max-h-[680px] min-h-[460px] sm:h-[75svh] lg:h-[82svh] lg:max-h-[760px]">
        <HeroSlideshow />

        <div className="relative z-10 flex h-full flex-col justify-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
            <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700">
              <p className="text-label font-medium uppercase tracking-wide text-accent">
                China to Ghana. Driven by trust.
              </p>
              <h1 className="mt-4 text-h1 font-semibold tracking-tight text-primary-foreground lg:text-display">
                Your next vehicle, sourced from China, delivered in Ghana.
              </h1>
              <p className="mt-5 max-w-xl text-body text-primary-foreground/85">
                We source, verify, ship and clear vehicles from trusted
                suppliers in China — giving you a clearer, safer and more
                convenient route to your next vehicle.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/source">Source My Vehicle</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link href="/vehicles">Explore Vehicles</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-primary-foreground/20 pt-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-h3 font-semibold text-primary-foreground">
                      {stat.value}
                    </p>
                    <p className="text-small text-primary-foreground/70">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
