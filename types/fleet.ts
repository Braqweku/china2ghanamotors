export type FleetEnquiry = {
  companyName: string;
  contactName: string;
  phone: string;
  email?: string;
  fleetSize: number;
  vehicleTypesNeeded: string;
  notes?: string;
  status: "submitted" | "reviewing" | "quoted";
};
