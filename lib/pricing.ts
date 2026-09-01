import type { Vehicle, VehicleType } from "@/types";

const SHIPPING_USD_BY_TYPE: Record<VehicleType, number> = {
  sedan: 1000,
  hatchback: 1000,
  suv: 1300,
  van: 1300,
  pickup: 1500,
  truck: 1500,
};

const INSPECTION_FEE_USD = 150;
const CLEARING_FEE_USD = 2000;

export function estimateLandedCost(vehicle: Vehicle) {
  const shippingUsd = SHIPPING_USD_BY_TYPE[vehicle.vehicleType];
  const inspectionUsd = INSPECTION_FEE_USD;
  const clearingUsd = CLEARING_FEE_USD;
  const totalUsd = vehicle.priceUsd + shippingUsd + inspectionUsd + clearingUsd;
  return { shippingUsd, inspectionUsd, clearingUsd, totalUsd };
}
