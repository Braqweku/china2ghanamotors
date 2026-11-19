import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Full-width photograph with a dark gradient so white text stays readable.
 * Content sits at the bottom-left unless `contentClassName` says otherwise.
 */
export function PhotoBand({
  src,
  alt,
  priority = false,
  overlay = "bottom",
  className,
  contentClassName,
  children,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  overlay?: "bottom" | "left" | "full";
  className?: string;
  contentClassName?: string;
  children?: ReactNode;
}) {
  const gradient = {
    bottom: "bg-gradient-to-t from-black/85 via-black/35 to-black/10",
    left: "bg-gradient-to-r from-black/85 via-black/55 to-black/15",
    full: "bg-black/55",
  }[overlay];

  return (
    <section className={cn("relative isolate overflow-hidden bg-[#070707]", className)}>
      <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden="true" className={cn("absolute inset-0 -z-10", gradient)} />
      {children && (
        <div className={cn("mx-auto flex h-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8", contentClassName)}>
          {children}
        </div>
      )}
    </section>
  );
}
