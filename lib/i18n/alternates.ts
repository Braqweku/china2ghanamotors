import { defaultLocale, locales, type Locale } from "./locales.ts";

/** Path for a page in a given language: English unprefixed, others under /<locale>. */
export function localizedPath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Canonical URL plus hreflang alternates for every language. */
export function alternatesFor(path: string, locale: Locale) {
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, localizedPath(path, l)])
  );
  languages["x-default"] = path;
  return { canonical: localizedPath(path, locale), languages };
}
