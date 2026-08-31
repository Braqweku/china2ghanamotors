export type VehicleType = "sedan" | "suv" | "pickup" | "van" | "hatchback" | "truck";
export type FuelType = "petrol" | "hybrid" | "electric" | "diesel";
export type Transmission = "automatic" | "manual";
export type Condition = "new" | "used";
export type Availability = "available" | "sourcing" | "sold";

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  vehicleType: VehicleType;
  fuelType: FuelType;
  transmission: Transmission;
  mileageKm: number;
  condition: Condition;
  priceUsd: number;
  images: string[];
  availability: Availability;
  supplierId: string;
  specs: Record<string, string>;
};
