"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ReferenceLookupForm({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/track?ref=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="e.g. C2G-8837XJ"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="font-mono"
        aria-label="Tracking reference"
      />
      <Button type="submit">Track</Button>
    </form>
  );
}
