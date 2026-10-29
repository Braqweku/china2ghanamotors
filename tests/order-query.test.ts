import { test } from "node:test";
import assert from "node:assert/strict";
import { filterOrders, orderStats, stagePhase, whatsappNumber } from "../lib/order-query.ts";
import type { Order } from "../types/order.ts";

function o(reference: string, over: Partial<Order> = {}): Order {
  return {
    reference, source: "sourcing", customerName: "Ama Mensah", customerPhone: "024 123 4567",
    customerEmail: null, summary: "Toyota Corolla Cross", currentStage: "received",
    createdAt: "2026-10-01T00:00:00Z", updatedAt: "2026-10-01T00:00:00Z", ...over,
  };
}
const orders = [
  o("C2G-AAA111"),
  o("C2G-BBB222", { customerName: "Kofi Boateng", source: "fleet", currentStage: "in_transit", summary: "10 sedans" }),
  o("C2G-CCC333", { currentStage: "delivered", summary: "BYD Seagull" }),
];

test("search matches reference, customer and summary, case-insensitive", () => {
  assert.deepEqual(filterOrders(orders, { q: "bbb" }).map((x) => x.reference), ["C2G-BBB222"]);
  assert.deepEqual(filterOrders(orders, { q: "kofi" }).map((x) => x.reference), ["C2G-BBB222"]);
  assert.deepEqual(filterOrders(orders, { q: "seagull" }).map((x) => x.reference), ["C2G-CCC333"]);
});
test("filters by stage and source", () => {
  assert.deepEqual(filterOrders(orders, { stage: "delivered" }).map((x) => x.reference), ["C2G-CCC333"]);
  assert.deepEqual(filterOrders(orders, { source: "fleet" }).map((x) => x.reference), ["C2G-BBB222"]);
  assert.equal(filterOrders(orders, {}).length, 3);
});
test("stats", () => {
  assert.deepEqual(orderStats(orders), { total: 3, inProgress: 2, shipping: 1, delivered: 1 });
});
test("stage phase", () => {
  assert.equal(stagePhase("received"), "early");
  assert.equal(stagePhase("purchased"), "early");
  assert.equal(stagePhase("ready_to_ship"), "shipping");
  assert.equal(stagePhase("ready_for_delivery"), "shipping");
  assert.equal(stagePhase("delivered"), "done");
});
test("whatsapp number normalises Ghana numbers", () => {
  assert.equal(whatsappNumber("024 123 4567"), "233241234567");
  assert.equal(whatsappNumber("+233 24 123 4567"), "233241234567");
  assert.equal(whatsappNumber("12"), null);
});
