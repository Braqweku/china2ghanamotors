import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { articleMeta } from "../lib/mock/articles.ts";
import { articlesEn } from "../lib/mock/articles/en.ts";
import { articlesFr } from "../lib/mock/articles/fr.ts";
import { articlesPt } from "../lib/mock/articles/pt.ts";
import { articlesZh } from "../lib/mock/articles/zh.ts";

type Tree = { [key: string]: Tree | string };

/** Flattens nested messages into "a.b.c" → value. Arrays flatten by index. */
function flatten(tree: Tree, prefix = ""): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out.set(path, value);
    else for (const [k, v] of flatten(value, path)) out.set(k, v);
  }
  return out;
}

const load = (locale: string) =>
  flatten(JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8")));
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)|<(\w+)>/g)].map((m) => m[1] ?? m[2]).sort();

const en = load("en");
const articles = { fr: articlesFr, pt: articlesPt, zh: articlesZh };

for (const locale of ["fr", "pt", "zh"] as const) {
  const messages = load(locale);

  test(`${locale}: same keys as English`, () => {
    assert.deepEqual([...messages.keys()].sort(), [...en.keys()].sort());
  });

  test(`${locale}: no empty strings`, () => {
    assert.deepEqual([...messages].filter(([, v]) => !v.trim()).map(([k]) => k), []);
  });

  test(`${locale}: same placeholders and tags as English`, () => {
    const mismatched = [...en]
      .filter(([k, v]) => JSON.stringify(placeholders(v)) !== JSON.stringify(placeholders(messages.get(k) ?? "")))
      .map(([k]) => k);
    assert.deepEqual(mismatched, []);
  });

  test(`${locale}: actually translated`, () => {
    const same = [...en].filter(([k, v]) => messages.get(k) === v).length;
    assert.ok(same / en.size < 0.15, `${same} of ${en.size} strings are still English`);
  });

  test(`${locale}: every article translated with the same paragraphs`, () => {
    for (const { slug } of articleMeta) {
      const text = articles[locale][slug];
      assert.ok(text, `missing ${slug}`);
      assert.equal(text.content.length, articlesEn[slug].content.length, slug);
      assert.notEqual(text.title, articlesEn[slug].title, slug);
    }
  });
}
