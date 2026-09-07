"use server";

import { createOrder } from "@/lib/data/orders";
import type { NewOrderInput } from "@/types/order";

export async function createOrderAction(input: NewOrderInput): Promise<void> {
  await createOrder(input);
}
