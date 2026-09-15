"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { mockVehicles } from "@/lib/mock/vehicles";

const SLIDE_DURATION = 5000;

const slides = [
  {
    src: "/vehicles/veh_001/veh_001_angle_03.jpg",
    vehicleId: "veh_001",
  },
  {
    src: "/vehicles/veh_010/veh_010_angle_03.jpg",
    vehicleId: "veh_010",
  },
  {
    src: "/vehicles/veh_021/veh_021_primary.jpg",
    vehicleId: "veh_021",
  },
  {
    src: "/vehicles/veh_003/veh_003_angle_08.jpg",
    vehicleId: "veh_003",
  },
  {
    src: "/vehicles/veh_004/veh_004_angle_03.jpg",
    vehicleId: "veh_004",
  },
  {
    src: "/vehicles/veh_007/veh_007_angle_03.jpg",
    vehicleId: "veh_007",
  },
  {
    src: "/vehicles/veh_011/veh_011_angle_03.jpg",
    vehicleId: "veh_011",
  },
].map((slide) => {
  const vehicle = mockVehicles.find((v) => v.id === slide.vehicleId)!;
  return {
    ...slide,
    vehicle,
    alt: `${vehicle.year} ${vehicle.make} ${vehicle.model}, one of the vehicles sourced by China2Ghana Motors`,
    caption: `${vehicle.make} ${vehicle.model}`,
  };
});

export function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hotspotOpen, setHotspotOpen] = useState(false);
  const activeVehicle = slides[active].vehicle;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || hotspotOpen) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [paused, reducedMotion, hotspotOpen]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-[var(--motion-slow)] ease-[var(--motion-ease)]",
            i === active ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            key={i === active ? `${slide.src}-active` : slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            className={cn(
              "object-cover",
              i === active && "animate-[hero-kenburns_5000ms_linear_forwards]"
            )}
            priority={i === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-primary/10" />

      <Popover open={hotspotOpen} onOpenChange={setHotspotOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Quick specs for the ${activeVehicle.make} ${activeVehicle.model}`}
            className="absolute right-4 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:right-6 sm:top-6 lg:right-8"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={10} className="w-64">
          <p className="text-small font-semibold text-foreground">
            {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
          </p>
          <p className="text-small text-muted-foreground">
            {activeVehicle.fuelType} · {activeVehicle.transmission} ·{" "}
            {activeVehicle.condition === "new" ? "New" : "Used"}
          </p>
          <Button asChild size="sm" className="mt-1 w-full">
            <Link href={`/vehicles/${activeVehicle.id}`}>
              View details
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </PopoverContent>
      </Popover>

      <div className="absolute inset-x-0 bottom-10 z-10 px-4 text-center sm:px-6 sm:text-left lg:px-8">
        <p
          aria-hidden="true"
          className="mx-auto max-w-7xl text-caption font-medium tracking-wide text-primary-foreground/70"
        >
          {slides[active].caption}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center gap-1.5 px-4 sm:justify-start sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl gap-1.5 sm:mx-0 sm:w-auto">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1} of ${slides.length}`}
              aria-current={i === active}
              className="h-1 w-8 overflow-hidden rounded-full bg-primary-foreground/25"
            >
              <span
                key={i === active ? "active" : "inactive"}
                className={cn(
                  "block h-full rounded-full bg-accent",
                  i < active && "w-full",
                  i > active && "w-0",
                  i === active &&
                    (paused
                      ? "w-full transition-[width] duration-300"
                      : "w-0 animate-[hero-progress_5000ms_linear_forwards]")
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
