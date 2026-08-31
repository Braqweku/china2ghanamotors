import type { Vehicle } from "@/types";
import { mockVehicles } from "@/lib/mock/vehicles";

export async function getVehicles(): Promise<Vehicle[]> {
  return [...mockVehicles];
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  return mockVehicles.find((vehicle) => vehicle.id === id) ?? null;
}
