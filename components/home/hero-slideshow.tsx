"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SLIDE_DURATION = 5000;

const slides = [
  {
    src: "/vehicles/veh_001/veh_001_angle_03.jpg",
    alt: "BYD Song Plus SUV, one of the vehicles sourced by China2Ghana Motors",
  },
  {
    src: "/vehicles/veh_010/veh_010_angle_03.jpg",
    alt: "BYD Han electric sedan, one of the vehicles sourced by China2Ghana Motors",
  },
  {
    src: "/vehicles/veh_004/veh_004_angle_03.jpg",
    alt: "Chery Tiggo 7 Pro SUV, one of the vehicles sourced by China2Ghana Motors",
  },
  {
    src: "/vehicles/veh_005/veh_005_angle_03.jpg",
    alt: "Geely Coolray SUV, one of the vehicles sourced by China2Ghana Motors",
  },
  {
    src: "/vehicles/veh_011/veh_011_angle_03.jpg",
    alt: "Dongfeng Rich 6 pickup, one of the vehicles sourced by China2Ghana Motors",
  },
];

export function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div>
      <div
        className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-muted shadow-lg"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
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
              sizes="(min-width: 1024px) 448px, 90vw"
              className={cn(
                "object-cover",
                i === active && "animate-[hero-kenburns_5000ms_linear_forwards]"
              )}
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show slide ${i + 1} of ${slides.length}`}
            aria-current={i === active}
            className="h-1 w-8 overflow-hidden rounded-full bg-border"
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
  );
}
