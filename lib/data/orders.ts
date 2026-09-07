import "server-only";
import { getSupabaseClient } from "@/lib/supabase";
import type { NewOrderInput, Order } from "@/types/order";
import type { TrackingEvent, TrackingStage } from "@/types/tracking";

type OrderRow = {
  reference: string;
  source: "sourcing" | "fleet";
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  summary: string;
  current_stage: TrackingStage;
  created_at: string;
  updated_at: string;
};

function toOrder(row: OrderRow): Order {
  return {
    reference: row.reference,
    source: row.source,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    summary: row.summary,
    currentStage: row.current_stage,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createOrder(input: NewOrderInput): Promise<void> {
  const supabase = getSupabaseClient();

  const { error: orderError } = await supabase.from("orders").insert({
    reference: input.reference,
    source: input.source,
    customer_name: input.customerName,
    customer_phone: input.customerPhone,
    customer_email: input.customerEmail ?? null,
    summary: input.summary,
    current_stage: "received",
  });
  if (orderError) throw orderError;

  const { error: eventError } = await supabase.from("tracking_events").insert({
    reference: input.reference,
    stage: "received",
  });
  if (eventError) throw eventError;
}

export async function getOrder(reference: string): Promise<Order | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw error;
  return data ? toOrder(data as OrderRow) : null;
}

export async function listOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as OrderRow[]).map(toOrder);
}

export async function getOrderTrackingEvents(reference: string): Promise<TrackingEvent[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("tracking_events")
    .select("reference, stage, note, created_at")
    .eq("reference", reference)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    reference: row.reference as string,
    stage: row.stage as TrackingStage,
    timestamp: row.created_at as string,
    note: (row.note as string | null) ?? undefined,
  }));
}

export async function addTrackingEvent(
  reference: string,
  stage: TrackingStage,
  note?: string
): Promise<void> {
  const supabase = getSupabaseClient();

  const { error: eventError } = await supabase.from("tracking_events").insert({
    reference,
    stage,
    note: note || null,
  });
  if (eventError) throw eventError;

  const { error: orderError } = await supabase
    .from("orders")
    .update({ current_stage: stage, updated_at: new Date().toISOString() })
    .eq("reference", reference);
  if (orderError) throw orderError;
}
