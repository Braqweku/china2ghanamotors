import { stageLabels } from "@/lib/tracking-stages";
import { stagePhase } from "@/lib/order-query";
import { cn } from "@/lib/utils";
import type { TrackingStage } from "@/types";

const dotByPhase = {
  early: "bg-muted-foreground",
  shipping: "bg-primary",
  done: "bg-success",
} as const;

export function StageStatus({ stage, className }: { stage: TrackingStage; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <span aria-hidden="true" className={cn("h-2 w-2 shrink-0 rounded-full", dotByPhase[stagePhase(stage)])} />
      {stageLabels[stage]}
    </span>
  );
}
