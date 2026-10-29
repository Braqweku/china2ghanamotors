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

export function formatMileage(km: number): string {
  return `${km.toLocaleString("en-US")} km`;
}

export function specLabel(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}
