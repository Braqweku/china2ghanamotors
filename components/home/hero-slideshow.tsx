"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
    }, 5000);
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
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(min-width: 1024px) 448px, 90vw"
            className={cn(
              "object-cover transition-opacity duration-[var(--motion-slow)] ease-[var(--motion-ease)]",
              i === active ? "opacity-100" : "opacity-0"
            )}
            priority={i === 0}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show slide ${i + 1} of ${slides.length}`}
            aria-current={i === active}
            className={cn(
              "h-1.5 rounded-full transition-all duration-[var(--motion-base)] ease-[var(--motion-ease)]",
              i === active
                ? "w-8 bg-accent"
                : "w-4 bg-border hover:bg-muted-foreground/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
