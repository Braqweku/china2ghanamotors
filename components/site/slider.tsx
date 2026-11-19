"use client";

import { useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const arrowClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Horizontally scrolling row with previous/next buttons beside the heading.
 * Uses native scrolling with snap points, so touch, trackpad and keyboard all work.
 */
export function Slider({
  heading,
  label,
  previousLabel,
  nextLabel,
  children,
  className,
}: {
  heading: ReactNode;
  label: string;
  previousLabel: string;
  nextLabel: string;
  children: ReactNode;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div className={className}>
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">{heading}</div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label={previousLabel} className={arrowClass}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={nextLabel} className={arrowClass}>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      {/* Side padding lines the first card up with the page container while letting cards run to the edge. */}
      <div
        ref={track}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:scroll-px-6 sm:px-6 lg:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
