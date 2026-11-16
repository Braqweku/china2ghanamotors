import { siteConfig } from "../config.ts";
import { localeNames, localeTags, type Locale } from "../i18n/locales.ts";

/** JSON for a <script type="application/ld+json"> tag; `<` is escaped so text can't close the tag. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const ORG_ID = `${siteConfig.url}/#organization`;
const ghana = { "@type": "Country", name: "Ghana" };

export function organizationSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo/china2ghana-logo.png`,
    image: `${siteConfig.url}/opengraph-image.png`,
    slogan: siteConfig.tagline,
    description,
    areaServed: ghana,
    knowsAbout: [
      "Importing cars from China to Ghana",
      "Shipping cars from China to Ghana",
      "RoRo and container vehicle shipping",
      "Vehicle customs clearing at Tema Port",
      "Electric and hybrid vehicles from China",
    ],
    contactPoint: [
      { contactType: "sales", email: siteConfig.contactEmail },
      { contactType: "customer service", email: siteConfig.infoEmail },
    ].map((point) => ({
      "@type": "ContactPoint",
      ...point,
      areaServed: "GH",
      availableLanguage: Object.values(localeNames),
    })),
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: localeTags[locale],
    publisher: { "@id": ORG_ID },
  };
}

export function serviceSchema({
  locale,
  url,
  name,
  description,
}: {
  locale: Locale;
  url: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    serviceType: "Vehicle import and shipping from China to Ghana",
    inLanguage: localeTags[locale],
    provider: { "@id": ORG_ID },
    areaServed: ghana,
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema({
  locale,
  url,
  headline,
  description,
  datePublished,
}: {
  locale: Locale;
  url: string;
  headline: string;
  description: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    inLanguage: localeTags[locale],
    mainEntityOfPage: url,
    image: `${siteConfig.url}/opengraph-image.png`,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}
