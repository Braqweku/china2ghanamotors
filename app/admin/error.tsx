"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
      <p className="text-muted-foreground">
        Please try again. If it keeps happening, check the server logs.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
