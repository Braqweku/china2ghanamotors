"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addTrackingEventAction } from "@/lib/admin-actions";
import { stageLabels, stageOrder } from "@/lib/tracking-stages";
import type { TrackingStage } from "@/types";

export function AddEventForm({
  reference,
  currentStage,
}: {
  reference: string;
  currentStage: TrackingStage;
}) {
  const [stage, setStage] = useState<TrackingStage>(currentStage);
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: boolean }, formData: FormData) => {
      const note = String(formData.get("note") ?? "");
      return addTrackingEventAction(reference, stage, note);
    },
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="stage">New stage</Label>
        <Select value={stage} onValueChange={(v) => setStage(v as TrackingStage)}>
          <SelectTrigger className="w-full" id="stage">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {stageOrder.map((s) => (
              <SelectItem key={s} value={s}>
                {stageLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea id="note" name="note" rows={3} placeholder="Visible internally only" />
      </div>
      {state?.error && <p className="text-small text-destructive">{state.error}</p>}
      {state?.success && <p className="text-small text-success">Updated.</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating…" : "Add update"}
      </Button>
    </form>
  );
}
