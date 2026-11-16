import { test } from "node:test";
import assert from "node:assert/strict";
import { serializeJsonLd, faqSchema, breadcrumbSchema } from "../lib/seo/json-ld.ts";
import { AI_CRAWLERS, robotsConfig } from "../lib/seo/robots.ts";
import { buildLlmsTxt } from "../lib/seo/llms.ts";

const BASE = "https://www.example.com";

test("JSON-LD cannot break out of its script tag", () => {
  const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
  assert.ok(!out.includes("</script>"));
  assert.deepEqual(JSON.parse(out), { name: "</script><script>alert(1)</script>" });
});

test("FAQ and breadcrumb schemas have the expected shape", () => {
  const faq = faqSchema([{ question: "Q?", answer: "A." }]);
  assert.equal(faq["@type"], "FAQPage");
  assert.equal(faq.mainEntity[0].acceptedAnswer.text, "A.");
  const crumbs = breadcrumbSchema([{ name: "Home", url: `${BASE}/` }, { name: "Shipping", url: `${BASE}/s` }]);
  assert.deepEqual(crumbs.itemListElement.map((i) => i.position), [1, 2]);
});

test("robots welcomes AI crawlers and keeps admin private", () => {
  const config = robotsConfig(BASE);
  const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
  for (const bot of AI_CRAWLERS) {
    const rule = rules.find((r) => [r.userAgent].flat().includes(bot));
    assert.ok(rule, `${bot} has a rule`);
    assert.equal(rule.allow, "/");
  }
  for (const rule of rules) assert.ok([rule.disallow].flat().includes("/admin"));
  assert.equal(config.sitemap, `${BASE}/sitemap.xml`);
});

test("llms.txt names the shipping page in every language and Tema Port", () => {
  const text = buildLlmsTxt(BASE);
  for (const prefix of ["", "/fr", "/pt", "/zh"]) {
    assert.ok(text.includes(`${BASE}${prefix}/shipping-cars-from-china-to-ghana`), prefix || "en");
  }
  assert.match(text, /Tema Port/);
  assert.match(text, /^# China2Ghana Motors/);
});
