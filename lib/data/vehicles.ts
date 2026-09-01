import type { Vehicle, VehicleFilters } from "@/types";
import { mockVehicles } from "@/lib/mock/vehicles";

export async function getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
  let results = mockVehicles;

  if (filters?.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (v) => v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
    );
  }
  if (filters?.vehicleType) {
    results = results.filter((v) => v.vehicleType === filters.vehicleType);
  }
  if (filters?.fuelType) {
    results = results.filter((v) => v.fuelType === filters.fuelType);
  }
  if (filters?.transmission) {
    results = results.filter((v) => v.transmission === filters.transmission);
  }
  if (filters?.condition) {
    results = results.filter((v) => v.condition === filters.condition);
  }
  if (filters?.minPrice !== undefined) {
    results = results.filter((v) => v.priceUsd >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    results = results.filter((v) => v.priceUsd <= filters.maxPrice!);
  }
  if (filters?.minYear !== undefined) {
    results = results.filter((v) => v.year >= filters.minYear!);
  }
  if (filters?.maxYear !== undefined) {
    results = results.filter((v) => v.year <= filters.maxYear!);
  }

  results = [...results];
  if (filters?.sort === "price-asc") results.sort((a, b) => a.priceUsd - b.priceUsd);
  if (filters?.sort === "price-desc") results.sort((a, b) => b.priceUsd - a.priceUsd);
  if (filters?.sort === "year-desc") results.sort((a, b) => b.year - a.year);

  return results;
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  return mockVehicles.find((vehicle) => vehicle.id === id) ?? null;
}
