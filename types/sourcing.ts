export type SourcingRequestStatus = "submitted" | "reviewing" | "quoted";

export type SourcingRequest = {
  vehicleQuery: string;
  budgetUsd: { min: number; max: number };
  specifications: string[];
  quantity: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
    whatsapp?: string;
    location?: string;
  };
  status: SourcingRequestStatus;
};
