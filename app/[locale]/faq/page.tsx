import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { FaqList, type FaqItem } from "@/components/faq/faq-list";
import { JsonLd } from "@/components/seo/json-ld";
import { alternatesFor } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/locales";
import { faqSchema } from "@/lib/seo/json-ld";
import { SHIPPING_PATH } from "@/lib/seo/llms";
import { siteConfig } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/faq", locale),
  };
}

// Question order and link targets; the wording lives in messages under faq.items.
const faqs: { id: string; href?: string }[] = [
  { id: "howItWorks", href: "/source" },
  { id: "shippingTime", href: SHIPPING_PATH },
  { id: "price" },
  { id: "tracking", href: "/track" },
  { id: "ev", href: "/ev" },
  { id: "documents", href: "/insights/clearing-customs-ghana" },
  { id: "inspection" },
  { id: "fleet", href: "/fleet" },
  { id: "condition", href: "/vehicles" },
  { id: "contact" },
];

export default async function FaqPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  const items: FaqItem[] = faqs.map((faq) => ({
    id: faq.id,
    question: t(`items.${faq.id}.q`),
    answer: t(`items.${faq.id}.a`, { email: siteConfig.contactEmail }),
    link: faq.href ? { href: faq.href, label: t(`items.${faq.id}.link`) } : undefined,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={faqSchema(items)} />
      <PageHeader title={t("title")} intro={t("intro")} />
      <FaqList items={items} className="mt-8" />
    </div>
  );
}
