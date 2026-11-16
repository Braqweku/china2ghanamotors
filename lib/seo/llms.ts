import { localizedPath } from "../i18n/alternates.ts";
import { localeNames, locales } from "../i18n/locales.ts";

export const SHIPPING_PATH = "/shipping-cars-from-china-to-ghana";

/** Plain-text site summary for AI assistants (https://llmstxt.org). */
export function buildLlmsTxt(baseUrl: string): string {
  const url = (path: string) => `${baseUrl}${path === "/" ? "" : path}`;

  return [
    "# China2Ghana Motors",
    "",
    "> China2Ghana Motors sources, inspects, ships and clears vehicles from verified suppliers in China for customers in Ghana. Vehicles are shipped to Tema Port, Ghana, by RoRo or container, and we handle customs clearing and delivery. Every request gets a personalized quote and a tracking reference.",
    "",
    "We ship vehicles only: sedans, SUVs, MPVs, pickups, electric and hybrid cars, for individuals, businesses and fleets. Prices depend on the vehicle, shipping method, inspection, Ghanaian import duties and exchange rates, so each customer receives a full quote.",
    "",
    "## Key pages",
    "",
    `- [Shipping cars from China to Ghana](${url(SHIPPING_PATH)}): how the process works, RoRo vs container, what affects cost, clearing at Tema Port, FAQ`,
    `- [Vehicles available now](${url("/vehicles")}): used vehicles in China, inspected before purchase`,
    `- [Electric and hybrid vehicles](${url("/ev")})`,
    `- [Source a vehicle](${url("/source")}): request any vehicle and get a quote`,
    `- [Fleet and corporate sourcing](${url("/fleet")})`,
    `- [Track an order](${url("/track")})`,
    `- [FAQ](${url("/faq")})`,
    `- [Insights](${url("/insights")}): buying, import, shipping and customs guides`,
    "",
    "## Languages",
    "",
    ...locales
      .filter((l) => l !== "en")
      .map((l) => `- ${localeNames[l]}: ${url(localizedPath(SHIPPING_PATH, l))}`),
    "",
    "## Contact",
    "",
    `- Request a vehicle: ${url("/source")}`,
    "",
  ].join("\n");
}
