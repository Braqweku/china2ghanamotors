"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
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

// usePathname from next/navigation includes the language prefix, so filter
// and sort URLs stay in the visitor's language.
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
  const t = useTranslations("vehicles");
  const tLabels = useTranslations("labels");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-query`} className="text-small text-muted-foreground">
          {t("search")}
        </Label>
        <Input
          id={`${idPrefix}-query`}
          type="search"
          placeholder={t("searchPlaceholder")}
          defaultValue={searchParams.get("query") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParam("query", e.currentTarget.value);
          }}
          onBlur={(e) => updateParam("query", e.target.value)}
        />
      </div>
      <FilterSelect
        id={`${idPrefix}-make`}
        label={t("brand")}
        param="make"
        allLabel={t("allBrands")}
        options={makes.map((m) => ({ value: m, label: m }))}
      />
      <FilterSelect
        id={`${idPrefix}-type`}
        label={t("bodyType")}
        param="vehicleType"
        allLabel={t("allBodyTypes")}
        options={vehicleTypes.map((v) => ({ value: v, label: tLabels(`bodyType.${v}`) }))}
      />
      <FilterSelect
        id={`${idPrefix}-fuel`}
        label={t("fuel")}
        param="fuelType"
        allLabel={t("allFuel")}
        options={fuelTypes.map((v) => ({ value: v, label: tLabels(`fuel.${v}`) }))}
      />
      <FilterSelect
        id={`${idPrefix}-gearbox`}
        label={t("gearbox")}
        param="transmission"
        allLabel={t("anyGearbox")}
        options={transmissions.map((v) => ({ value: v, label: tLabels(`gearbox.${v}`) }))}
      />
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-small text-muted-foreground">{t("year")}</legend>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="numeric"
            aria-label={t("minYear")}
            placeholder={t("from")}
            defaultValue={searchParams.get("minYear") ?? ""}
            onBlur={(e) => updateParam("minYear", e.target.value)}
          />
          <Input
            type="number"
            inputMode="numeric"
            aria-label={t("maxYear")}
            placeholder={t("to")}
            defaultValue={searchParams.get("maxYear") ?? ""}
            onBlur={(e) => updateParam("maxYear", e.target.value)}
          />
        </div>
      </fieldset>
      <Button variant="outline" asChild>
        <Link href={pathname}>{t("clear")}</Link>
      </Button>
    </div>
  );
}

const sortKeys = { recent: "sortRecent", "year-desc": "sortYear", "mileage-asc": "sortMileage" } as const;
type SortValue = keyof typeof sortKeys;

export function VehicleSortSelect() {
  const { updateParam, searchParams } = useUpdateParam();
  const t = useTranslations("vehicles");
  const param = searchParams.get("sort");
  const current: SortValue = param && param in sortKeys ? (param as SortValue) : "recent";

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="vehicle-sort" className="text-small text-muted-foreground">
        {t("sort")}
      </Label>
      <Select value={current} onValueChange={(v) => updateParam("sort", v === "recent" ? "" : v)}>
        <SelectTrigger id="vehicle-sort" className="w-auto min-w-44">
          <SelectValue>{t(sortKeys[current])}</SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          {(Object.keys(sortKeys) as SortValue[]).map((value) => (
            <SelectItem key={value} value={value}>
              {t(sortKeys[value])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function VehicleFilters({ makes }: { makes: string[] }) {
  const t = useTranslations("vehicles");

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
              {t("filters")}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
            <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
              <SheetTitle>{t("filters")}</SheetTitle>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <FilterFields makes={makes} idPrefix="mobile" />
            </div>
            <div className="shrink-0 border-t border-border p-4">
              <SheetClose asChild>
                <Button className="w-full" size="lg">
                  {t("showResults")}
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
