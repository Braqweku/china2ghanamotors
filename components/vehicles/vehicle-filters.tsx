"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import type { FuelType, Transmission, VehicleType } from "@/types";
import { fuelTypeLabels, transmissionLabels, vehicleTypeLabels } from "@/lib/vehicle-format";

const vehicleTypes = Object.keys(vehicleTypeLabels) as VehicleType[];
const fuelTypes = Object.keys(fuelTypeLabels) as FuelType[];
const transmissions = Object.keys(transmissionLabels) as Transmission[];

function useUpdateParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === "all") params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return { updateParam, searchParams, pathname };
}

function FilterSelect({
  id,
  label,
  param,
  allLabel,
  options,
}: {
  id: string;
  label: string;
  param: string;
  allLabel: string;
  options: { value: string; label: string }[];
}) {
  const { updateParam, searchParams } = useUpdateParam();
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-small text-muted-foreground">
        {label}
      </Label>
      <Select value={searchParams.get(param) ?? "all"} onValueChange={(v) => updateParam(param, v)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function FilterFields({ makes, idPrefix }: { makes: string[]; idPrefix: string }) {
  const { updateParam, searchParams, pathname } = useUpdateParam();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-query`} className="text-small text-muted-foreground">
          Search
        </Label>
        <Input
          id={`${idPrefix}-query`}
          type="search"
          placeholder="Make, model or trim"
          defaultValue={searchParams.get("query") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParam("query", e.currentTarget.value);
          }}
          onBlur={(e) => updateParam("query", e.target.value)}
        />
      </div>
      <FilterSelect
        id={`${idPrefix}-make`}
        label="Brand"
        param="make"
        allLabel="All brands"
        options={makes.map((m) => ({ value: m, label: m }))}
      />
      <FilterSelect
        id={`${idPrefix}-type`}
        label="Body type"
        param="vehicleType"
        allLabel="All body types"
        options={vehicleTypes.map((t) => ({ value: t, label: vehicleTypeLabels[t] }))}
      />
      <FilterSelect
        id={`${idPrefix}-fuel`}
        label="Fuel"
        param="fuelType"
        allLabel="All fuel types"
        options={fuelTypes.map((t) => ({ value: t, label: fuelTypeLabels[t] }))}
      />
      <FilterSelect
        id={`${idPrefix}-gearbox`}
        label="Gearbox"
        param="transmission"
        allLabel="Any gearbox"
        options={transmissions.map((t) => ({ value: t, label: transmissionLabels[t] }))}
      />
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-small text-muted-foreground">Year</legend>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="numeric"
            aria-label="Minimum year"
            placeholder="From"
            defaultValue={searchParams.get("minYear") ?? ""}
            onBlur={(e) => updateParam("minYear", e.target.value)}
          />
          <Input
            type="number"
            inputMode="numeric"
            aria-label="Maximum year"
            placeholder="To"
            defaultValue={searchParams.get("maxYear") ?? ""}
            onBlur={(e) => updateParam("maxYear", e.target.value)}
          />
        </div>
      </fieldset>
      <Button variant="outline" asChild>
        <Link href={pathname}>Clear filters</Link>
      </Button>
    </div>
  );
}

export function VehicleSortSelect() {
  const { updateParam, searchParams } = useUpdateParam();
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="vehicle-sort" className="text-small text-muted-foreground">
        Sort
      </Label>
      <Select
        value={searchParams.get("sort") ?? "recent"}
        onValueChange={(v) => updateParam("sort", v === "recent" ? "" : v)}
      >
        <SelectTrigger id="vehicle-sort" className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="recent">Recently added</SelectItem>
          <SelectItem value="year-desc">Newest year</SelectItem>
          <SelectItem value="mileage-asc">Lowest mileage</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function VehicleFilters({ makes }: { makes: string[] }) {
  return (
    <>
      <div className="hidden lg:block">
        <FilterFields makes={makes} idPrefix="desktop" />
      </div>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
            <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
              <SheetTitle>Filters</SheetTitle>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <FilterFields makes={makes} idPrefix="mobile" />
            </div>
            <div className="shrink-0 border-t border-border p-4">
              <SheetClose asChild>
                <Button className="w-full" size="lg">
                  Show results
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
