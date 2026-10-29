"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { stageLabels, stageOrder } from "@/lib/tracking-stages";

const sourceLabels: Record<string, string> = {
  all: "All request types",
  sourcing: "Sourcing",
  fleet: "Fleet",
};

export function OrderFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === "all") params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const stage = searchParams.get("stage") ?? "all";
  const source = searchParams.get("source") ?? "all";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative sm:max-w-xs sm:flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          aria-label="Search orders"
          placeholder="Reference, customer or vehicle"
          className="pl-9"
          defaultValue={searchParams.get("q") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", e.currentTarget.value);
          }}
          onBlur={(e) => update("q", e.target.value)}
        />
      </div>
      <Select value={stage} onValueChange={(v) => update("stage", v)}>
        <SelectTrigger aria-label="Filter by stage" className="sm:w-48">
          <SelectValue>{stage === "all" ? "All stages" : stageLabels[stage as keyof typeof stageLabels]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All stages</SelectItem>
          {stageOrder.map((s) => (
            <SelectItem key={s} value={s}>
              {stageLabels[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={source} onValueChange={(v) => update("source", v)}>
        <SelectTrigger aria-label="Filter by request type" className="sm:w-44">
          <SelectValue>{sourceLabels[source] ?? sourceLabels.all}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(sourceLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
