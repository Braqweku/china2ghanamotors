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

export type VehicleSort = "price-asc" | "price-desc" | "year-desc";

export type VehicleFilters = {
  query?: string;
  vehicleType?: VehicleType;
  fuelType?: FuelType;
  transmission?: Transmission;
  condition?: Condition;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  sort?: VehicleSort;
};
