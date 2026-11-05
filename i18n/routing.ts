import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "@/lib/i18n/locales";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  // First-visit detection and the language cookie are handled in middleware.ts
  // with lib/i18n/detect.ts, so next-intl only routes.
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
});
