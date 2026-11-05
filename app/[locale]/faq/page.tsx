import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHeader } from "@/components/layout/page-header";
import { alternatesFor } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/locales";
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
  { id: "shippingTime", href: "/insights/understanding-vehicle-shipping" },
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

  const items = faqs.map((faq) => ({
    ...faq,
    question: t(`items.${faq.id}.q`),
    answer: t(`items.${faq.id}.a`, { email: siteConfig.contactEmail }),
    linkLabel: faq.href ? t(`items.${faq.id}.link`) : undefined,
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHeader title={t("title")} intro={t("intro")} />

      <Accordion type="single" collapsible className="mt-8 border-t border-border">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border-b border-border">
            <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
              <span className="text-body font-semibold text-foreground">{item.question}</span>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <p className="text-body text-muted-foreground">{item.answer}</p>
              {item.href && (
                <Link
                  href={item.href}
                  className="mt-3 inline-block text-small font-medium text-foreground underline underline-offset-4"
                >
                  {item.linkLabel}
                </Link>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
