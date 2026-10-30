import { test } from "node:test";
import assert from "node:assert/strict";
import { detectLocale } from "../lib/i18n/detect.ts";

test("cookie wins over everything", () => {
  assert.equal(detectLocale({ cookie: "pt", acceptLanguage: "fr", country: "CN" }), "pt");
});

test("invalid cookie is ignored", () => {
  assert.equal(detectLocale({ cookie: "de", acceptLanguage: "fr-FR" }), "fr");
});

test("accept-language respects q-values and regional tags", () => {
  assert.equal(detectLocale({ acceptLanguage: "de;q=0.9, zh-Hant-TW;q=0.95" }), "zh");
  assert.equal(detectLocale({ acceptLanguage: "pt-BR,en;q=0.8" }), "pt");
});

test("browser language beats country", () => {
  assert.equal(detectLocale({ acceptLanguage: "zh-CN", country: "GH" }), "zh");
  assert.equal(detectLocale({ acceptLanguage: "en-GB", country: "CI" }), "en");
});

test("unsupported browser language falls back to country", () => {
  assert.equal(detectLocale({ acceptLanguage: "wo-SN", country: "SN" }), "fr");
  assert.equal(detectLocale({ acceptLanguage: "ar", country: "ao" }), "pt");
});

test("nothing usable means English", () => {
  assert.equal(detectLocale({}), "en");
  assert.equal(detectLocale({ acceptLanguage: "*", country: "GH" }), "en");
});
