import type { FuelType, Transmission, Vehicle, VehicleType } from "@/types";

export const vehicleTypeLabels: Record<VehicleType, string> = {
  sedan: "Sedan",
  suv: "SUV",
  mpv: "MPV",
  pickup: "Pickup",
  van: "Van",
  hatchback: "Hatchback",
  truck: "Truck",
};

export const fuelTypeLabels: Record<FuelType, string> = {
  petrol: "Petrol",
  hybrid: "Hybrid",
  electric: "Electric",
  diesel: "Diesel",
};

export const transmissionLabels: Record<Transmission, string> = {
  automatic: "Automatic",
  manual: "Manual",
};

export function vehicleTitle(v: Pick<Vehicle, "year" | "make" | "model">): string {
  return `${v.year} ${v.make} ${v.model}`;
}

export function formatMileage(km: number, localeTag = "en-US"): string {
  return `${km.toLocaleString(localeTag)} km`;
}

export function specLabel(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

/** Spec keys in the data ("first registered") as message keys ("firstRegistered"). */
export function specMessageKey(key: string): string {
  return key.replace(/ (\w)/g, (_, c: string) => c.toUpperCase());
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Nov 2023" → month and year in the reader's language; anything else unchanged. */
export function formatRegistered(value: string, localeTag: string): string {
  const match = /^([A-Z][a-z]{2}) (\d{4})$/.exec(value);
  const month = match ? MONTHS.indexOf(match[1]) : -1;
  if (!match || month < 0) return value;
  return new Intl.DateTimeFormat(localeTag, { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(Number(match[2]), month, 1))
  );
}

type EngineWords = { pluginHybrid: string; hybrid: string; diesel: string };

/** Translates the fuel word in an engine spec ("1.5T Plug-in Hybrid"), keeping the size. */
export function translateEngine(value: string, words: EngineWords): string {
  const byWord: Record<string, string> = {
    "Plug-in Hybrid": words.pluginHybrid,
    Hybrid: words.hybrid,
    Diesel: words.diesel,
  };
  return value.replace(/\b(Plug-in Hybrid|Hybrid|Diesel)\b/, (m) => byWord[m]);
}
