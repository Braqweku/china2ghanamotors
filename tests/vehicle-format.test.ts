import { test } from "node:test";
import assert from "node:assert/strict";
import { formatMileage, fuelTypeLabels, specLabel, transmissionLabels, vehicleTitle, vehicleTypeLabels } from "../lib/vehicle-format.ts";

test("title", () => assert.equal(vehicleTitle({ year: 2023, make: "Toyota", model: "Sienna" }), "2023 Toyota Sienna"));
test("mileage", () => {
  assert.equal(formatMileage(57000), "57,000 km");
  assert.equal(formatMileage(0), "0 km");
});
test("labels", () => {
  assert.equal(vehicleTypeLabels.suv, "SUV");
  assert.equal(vehicleTypeLabels.mpv, "MPV");
  assert.equal(fuelTypeLabels.electric, "Electric");
  assert.equal(transmissionLabels.manual, "Manual");
});
test("spec label sentence case", () => {
  assert.equal(specLabel("first registered"), "First registered");
  assert.equal(specLabel("range"), "Range");
});
