"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import type { FuelType, Transmission, VehicleType } from "@/types";

const vehicleTypes: VehicleType[] = ["sedan", "suv", "pickup", "van", "hatchback", "truck"];
const fuelTypes: FuelType[] = ["petrol", "hybrid", "electric", "diesel"];
const transmissions: Transmission[] = ["automatic", "manual"];

function FilterFields() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === "all" || value === "default") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search make or model"
        defaultValue={searchParams.get("query") ?? ""}
        onBlur={(e) => updateParam("query", e.target.value)}
      />

      <Select
        value={searchParams.get("vehicleType") ?? "all"}
        onValueChange={(v) => updateParam("vehicleType", v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Vehicle type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {vehicleTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("fuelType") ?? "all"}
        onValueChange={(v) => updateParam("fuelType", v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Fuel type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All fuel types</SelectItem>
          {fuelTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("transmission") ?? "all"}
        onValueChange={(v) => updateParam("transmission", v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Transmission" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any transmission</SelectItem>
          {transmissions.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("condition") ?? "all"}
        onValueChange={(v) => updateParam("condition", v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">New or used</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="used">Used</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          placeholder="Min price"
          defaultValue={searchParams.get("minPrice") ?? ""}
          onBlur={(e) => updateParam("minPrice", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max price"
          defaultValue={searchParams.get("maxPrice") ?? ""}
          onBlur={(e) => updateParam("maxPrice", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          placeholder="Min year"
          defaultValue={searchParams.get("minYear") ?? ""}
          onBlur={(e) => updateParam("minYear", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max year"
          defaultValue={searchParams.get("maxYear") ?? ""}
          onBlur={(e) => updateParam("maxYear", e.target.value)}
        />
      </div>

      <Select
        value={searchParams.get("sort") ?? "default"}
        onValueChange={(v) => updateParam("sort", v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Sort</SelectItem>
          <SelectItem value="price-asc">Price: low to high</SelectItem>
          <SelectItem value="price-desc">Price: high to low</SelectItem>
          <SelectItem value="year-desc">Year: newest first</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" asChild>
        <Link href={pathname}>Clear filters</Link>
      </Button>
    </div>
  );
}

export function VehicleFilters() {
  return (
    <>
      <div className="hidden lg:block">
        <FilterFields />
      </div>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
            <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
              <SheetTitle>Filters</SheetTitle>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <FilterFields />
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
