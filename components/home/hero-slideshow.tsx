"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SLIDE_DURATION = 5000;

const slides = [
  {
    src: "/vehicles/veh_001/veh_001_angle_03.jpg",
    alt: "BYD Song Plus SUV, one of the vehicles sourced by China2Ghana Motors",
    caption: "BYD Song Plus",
  },
  {
    src: "/vehicles/veh_010/veh_010_angle_03.jpg",
    alt: "BYD Han electric sedan, one of the vehicles sourced by China2Ghana Motors",
    caption: "BYD Han",
  },
  {
    src: "/vehicles/veh_021/veh_021_primary.jpg",
    alt: "Dongfeng Nammi 01 electric crossover, one of the vehicles sourced by China2Ghana Motors",
    caption: "Dongfeng Nammi 01",
  },
  {
    src: "/vehicles/veh_003/veh_003_angle_08.jpg",
    alt: "JAC T8 pickup, one of the vehicles sourced by China2Ghana Motors",
    caption: "JAC T8 Pickup",
  },
  {
    src: "/vehicles/veh_004/veh_004_angle_03.jpg",
    alt: "Chery Tiggo 7 Pro SUV, one of the vehicles sourced by China2Ghana Motors",
    caption: "Chery Tiggo 7 Pro",
  },
  {
    src: "/vehicles/veh_007/veh_007_angle_03.jpg",
    alt: "MG 5 sedan, one of the vehicles sourced by China2Ghana Motors",
    caption: "MG 5",
  },
  {
    src: "/vehicles/veh_011/veh_011_angle_03.jpg",
    alt: "Dongfeng Rich 6 pickup, one of the vehicles sourced by China2Ghana Motors",
    caption: "Dongfeng Rich 6",
  },
];

export function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [paused, reducedMotion]);

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
