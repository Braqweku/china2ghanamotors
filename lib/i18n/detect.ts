import { defaultLocale, isLocale, type Locale } from "./locales.ts";

/** Used only when the browser language is not one we offer. */
const countryLocale: Record<string, Locale> = {
  // Francophone Africa and Europe
  CI: "fr", SN: "fr", TG: "fr", BJ: "fr", BF: "fr", ML: "fr", NE: "fr", GN: "fr",
  CM: "fr", CD: "fr", CG: "fr", GA: "fr", TD: "fr", CF: "fr", MG: "fr", DJ: "fr",
  KM: "fr", BI: "fr", RW: "fr", MR: "fr", FR: "fr", BE: "fr", LU: "fr", MC: "fr",
  // Lusophone countries
  AO: "pt", MZ: "pt", GW: "pt", CV: "pt", ST: "pt", BR: "pt", PT: "pt", TL: "pt",
  // Chinese-speaking
  CN: "zh", HK: "zh", MO: "zh", TW: "zh", SG: "zh",
};

/** Language tags from an Accept-Language header, most preferred first. */
function preferredLanguages(header: string): string[] {
  return header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.slice(2)) : 1, index };
    })
    .filter((l) => l.tag && l.tag !== "*" && Number.isFinite(l.q) && l.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index)
    .map((l) => l.tag);
}

/**
 * First-visit language: the visitor's saved choice, then the language their
 * browser asks for, then their country, then English.
 */
export function detectLocale({
  cookie,
  acceptLanguage,
  country,
}: {
  cookie?: string | null;
  acceptLanguage?: string | null;
  country?: string | null;
}): Locale {
  if (isLocale(cookie)) return cookie;

  for (const tag of preferredLanguages(acceptLanguage ?? "")) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  const fromCountry = country ? countryLocale[country.toUpperCase()] : undefined;
  return fromCountry ?? defaultLocale;
}
