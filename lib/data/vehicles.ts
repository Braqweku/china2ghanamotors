import type { Vehicle, VehicleFilters } from "@/types";
import { mockVehicles } from "@/lib/mock/vehicles";
import { filterVehicles, listMakes } from "@/lib/vehicle-query";

export async function getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
  return filterVehicles(mockVehicles, filters);
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  return mockVehicles.find((vehicle) => vehicle.id === id) ?? null;
}

export async function getMakes(): Promise<string[]> {
  return listMakes(mockVehicles);
}
