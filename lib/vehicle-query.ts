import type { Vehicle, VehicleFilters, VehicleSort } from "@/types";

export function sortVehicles(vehicles: Vehicle[], sort?: VehicleSort): Vehicle[] {
  const result = [...vehicles];
  if (sort === "year-desc") result.sort((a, b) => b.year - a.year);
  if (sort === "mileage-asc") result.sort((a, b) => a.mileageKm - b.mileageKm);
  return result;
}

export function filterVehicles(vehicles: Vehicle[], filters: VehicleFilters = {}): Vehicle[] {
  let results = vehicles;
  if (filters.query) {
    const q = filters.query.trim().toLowerCase();
    results = results.filter((v) =>
      `${v.make} ${v.model} ${v.specs.trim ?? ""}`.toLowerCase().includes(q)
    );
  }
  if (filters.make) results = results.filter((v) => v.make === filters.make);
  if (filters.vehicleType) results = results.filter((v) => v.vehicleType === filters.vehicleType);
  if (filters.fuelType) results = results.filter((v) => v.fuelType === filters.fuelType);
  if (filters.transmission) results = results.filter((v) => v.transmission === filters.transmission);
  if (filters.condition) results = results.filter((v) => v.condition === filters.condition);
  if (filters.minYear !== undefined) results = results.filter((v) => v.year >= filters.minYear!);
  if (filters.maxYear !== undefined) results = results.filter((v) => v.year <= filters.maxYear!);
  return sortVehicles(results, filters.sort);
}

export function listMakes(vehicles: Vehicle[]): string[] {
  return [...new Set(vehicles.map((v) => v.make))].sort((a, b) => a.localeCompare(b));
}

export function similarVehicles(vehicles: Vehicle[], current: Vehicle, limit = 4): Vehicle[] {
  return vehicles
    .filter((v) => v.id !== current.id && v.vehicleType === current.vehicleType)
    .slice(0, limit);
}
