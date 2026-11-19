import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** "• Label" above a large heading, as on every DriveHub section. */
export function SectionHeading({
  label,
  title,
  intro,
  align = "left",
  as: Heading = "h2",
  tone = "dark",
  action,
  className,
}: {
  label?: string;
  title: string;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  tone?: "dark" | "light";
  action?: ReactNode;
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        !centered && action && "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
        {label && (
          <p
            className={cn(
              "flex items-center gap-2 text-small",
              centered && "justify-center",
              tone === "light" ? "text-white/75" : "text-muted-foreground"
            )}
          >
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
            {label}
          </p>
        )}
        <Heading
          className={cn(
            "mt-3 font-medium",
            Heading === "h1" ? "text-h1" : "text-h2",
            tone === "light" ? "text-white" : "text-foreground"
          )}
        >
          {title}
        </Heading>
        {intro && (
          <p
            className={cn(
              "mt-4 max-w-2xl text-body",
              centered && "mx-auto",
              tone === "light" ? "text-white/80" : "text-muted-foreground"
            )}
          >
            {intro}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
