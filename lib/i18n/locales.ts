export const locales = ["en", "fr", "pt", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Each language in its own name, as shown in the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  pt: "Português",
  zh: "中文",
};

/** BCP 47 tags for Intl formatting and Open Graph. */
export const localeTags: Record<Locale, string> = {
  en: "en-GB",
  fr: "fr-FR",
  pt: "pt-PT",
  zh: "zh-CN",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
