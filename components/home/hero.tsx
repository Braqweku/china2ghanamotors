import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M40 320 C 220 320, 260 120, 440 120 S 700 40, 760 40"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="3"
        />
        <path
          d="M600 60 L640 40 L600 20"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
        <h1 className="text-display font-semibold uppercase tracking-tight text-foreground">
          Your Next Vehicle Starts In China.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-body text-muted-foreground">
          We source, verify, ship and deliver vehicles from trusted suppliers in
          China — giving you a clearer, safer and more convenient route to your
          next vehicle in Ghana.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/source">Source My Vehicle</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/vehicles">Explore Vehicles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
