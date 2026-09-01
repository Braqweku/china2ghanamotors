"use client";

import { useState } from "react";
import Image from "next/image";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

export function VehicleGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] max-w-md items-center justify-center rounded-lg bg-muted">
        <Car className="h-20 w-20 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[3/4] max-w-md overflow-hidden rounded-lg bg-muted">
        <Image
          src={images[activeIndex]}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 448px, 100vw"
          priority
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex max-w-md gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View angle ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 bg-muted transition-colors",
                index === activeIndex ? "border-accent" : "border-transparent"
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
