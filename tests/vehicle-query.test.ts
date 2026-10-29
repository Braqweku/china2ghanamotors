import { test } from "node:test";
import assert from "node:assert/strict";
import { filterVehicles, listMakes, similarVehicles, sortVehicles } from "../lib/vehicle-query.ts";
import type { Vehicle } from "../types/vehicle.ts";

function v(id: string, over: Partial<Vehicle> = {}): Vehicle {
  return {
    id, make: "Toyota", model: "Camry", year: 2020, vehicleType: "sedan", fuelType: "petrol",
    transmission: "automatic", mileageKm: 50000, condition: "used", images: [],
    availability: "available", supplierId: "sup_006", specs: { trim: "2.0G Luxury" }, ...over,
  };
}
const list = [
  v("a", { make: "Toyota", year: 2019, mileageKm: 90000 }),
  v("b", { make: "BYD", model: "Seagull", year: 2025, mileageKm: 10000, vehicleType: "hatchback", fuelType: "electric" }),
  v("c", { make: "Honda", model: "CR-V", year: 2021, mileageKm: 60000, vehicleType: "suv" }),
  v("d", { make: "Toyota", model: "Highlander", year: 2021, mileageKm: 70000, vehicleType: "suv", specs: { trim: "Elite" } }),
];

test("filters by make", () => {
  assert.deepEqual(filterVehicles(list, { make: "Toyota" }).map((x) => x.id), ["a", "d"]);
});
test("query matches make, model and trim", () => {
  assert.deepEqual(filterVehicles(list, { query: "seagull" }).map((x) => x.id), ["b"]);
  assert.deepEqual(filterVehicles(list, { query: "elite" }).map((x) => x.id), ["d"]);
});
test("combines filters", () => {
  assert.deepEqual(filterVehicles(list, { vehicleType: "suv", minYear: 2021, make: "Honda" }).map((x) => x.id), ["c"]);
});
test("sorts", () => {
  assert.deepEqual(sortVehicles(list, "mileage-asc").map((x) => x.id), ["b", "c", "d", "a"]);
  assert.deepEqual(sortVehicles(list, "year-desc").map((x) => x.id)[0], "b");
  assert.deepEqual(sortVehicles(list, "recent").map((x) => x.id), ["a", "b", "c", "d"]);
  assert.deepEqual(sortVehicles(list).map((x) => x.id), ["a", "b", "c", "d"]);
});
test("sort does not mutate input", () => {
  sortVehicles(list, "mileage-asc");
  assert.equal(list[0].id, "a");
});
test("lists makes alphabetically, unique", () => {
  assert.deepEqual(listMakes(list), ["BYD", "Honda", "Toyota"]);
});
test("similar vehicles share body type and exclude current", () => {
  assert.deepEqual(similarVehicles(list, list[2]).map((x) => x.id), ["d"]);
  assert.equal(similarVehicles(list, list[0], 0).length, 0);
});
