import { test } from "node:test";
import assert from "node:assert/strict";
import { formatMileage, formatRegistered, fuelTypeLabels, specLabel, specMessageKey, translateEngine, transmissionLabels, vehicleTitle, vehicleTypeLabels } from "../lib/vehicle-format.ts";

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

test("mileage in another locale", () => {
  assert.equal(formatMileage(57000, "fr-FR").replace(/\s/g, " "), "57 000 km");
  assert.equal(formatMileage(57000, "zh-CN"), "57,000 km");
});
test("spec message keys", () => {
  assert.equal(specMessageKey("first registered"), "firstRegistered");
  assert.equal(specMessageKey("electric range"), "electricRange");
  assert.equal(specMessageKey("range"), "range");
});
test("registration month in the reader's language", () => {
  assert.equal(formatRegistered("Nov 2023", "en-GB"), "November 2023");
  assert.equal(formatRegistered("Nov 2023", "fr-FR"), "novembre 2023");
  assert.equal(formatRegistered("Nov 2023", "zh-CN"), "2023年11月");
  assert.equal(formatRegistered("not a date", "fr-FR"), "not a date");
});
test("engine words translated, sizes kept", () => {
  const words = { pluginHybrid: "Hybride rechargeable", hybrid: "Hybride", diesel: "Diesel" };
  assert.equal(translateEngine("1.5T Plug-in Hybrid", words), "1.5T Hybride rechargeable");
  assert.equal(translateEngine("2.5L Hybrid", words), "2.5L Hybride");
  assert.equal(translateEngine("2.0T Diesel", words), "2.0T Diesel");
  assert.equal(translateEngine("1.5T", words), "1.5T");
});
