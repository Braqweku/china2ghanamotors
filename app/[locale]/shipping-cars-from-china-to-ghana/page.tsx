import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { FaqList, type FaqItem } from "@/components/faq/faq-list";
import { JsonLd } from "@/components/seo/json-ld";
import { alternatesFor, localizedPath } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/locales";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/seo/json-ld";
import { SHIPPING_PATH } from "@/lib/seo/llms";
import { siteConfig } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shipping" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(SHIPPING_PATH, locale),
    openGraph: { type: "article", title: t("metaTitle"), description: t("metaDescription") },
  };
}

// Question order; the wording lives in messages under shipping.faq.
const faqIds = ["howTo", "time", "cost", "port", "method", "ev", "clearing", "tracking"] as const;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="text-h2 font-semibold text-foreground">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function ShippingPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shipping");
  const tVehicle = await getTranslations("vehicle");

  const steps = t.raw("steps") as { title: string; body: string }[];
  const costFactors = t.raw("costFactors") as string[];
  const faqs: FaqItem[] = faqIds.map((id) => ({
    id,
    question: t(`faq.${id}.q`),
    answer: t(`faq.${id}.a`),
  }));

  const pageUrl = `${siteConfig.url}${localizedPath(SHIPPING_PATH, locale)}`;
  const homeUrl = `${siteConfig.url}${localizedPath("/", locale)}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={serviceSchema({ locale, url: pageUrl, name: t("title"), description: t("metaDescription") })}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: tVehicle("home"), url: homeUrl },
          { name: t("breadcrumb"), url: pageUrl },
        ])}
      />

      <nav aria-label="Breadcrumb" className="text-small text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-foreground">
              {tVehicle("home")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {t("breadcrumb")}
          </li>
        </ol>
      </nav>

      <header className="mt-4">
        <h1 className="text-h1 font-semibold tracking-tight text-foreground">{t("title")}</h1>
        <p className="mt-4 text-body leading-relaxed text-foreground">{t("answer")}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/source">{t("ctaRequest")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/vehicles">{t("ctaBrowse")}</Link>
          </Button>
        </div>
      </header>

      <Section id="steps-heading" title={t("stepsTitle")}>
        <ol className="flex flex-col gap-5 border-t border-border pt-5">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-small font-semibold tabular-nums text-foreground"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-body font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-body text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="methods-heading" title={t("methodsTitle")}>
        <dl className="grid border-t border-border sm:grid-cols-2 sm:gap-x-8">
          {(["roro", "container"] as const).map((method) => (
            <div key={method} className="border-b border-border py-5">
              <dt className="text-body font-semibold text-foreground">{t(`${method}Title`)}</dt>
              <dd className="mt-1 text-body text-muted-foreground">{t(`${method}Body`)}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="cost-heading" title={t("costTitle")}>
        <p className="text-body text-muted-foreground">{t("costIntro")}</p>
        <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-body text-foreground">
          {costFactors.map((factor) => (
            <li key={factor}>{factor}</li>
          ))}
        </ul>
        <p className="mt-4 text-body text-muted-foreground">{t("costNote")}</p>
      </Section>

      <Section id="clearing-heading" title={t("clearingTitle")}>
        <p className="text-body text-muted-foreground">{t("clearingBody")}</p>
      </Section>

      <Section id="faq-heading" title={t("faqTitle")}>
        <FaqList items={faqs} />
      </Section>

      <aside className="mt-12 rounded-lg border border-border bg-card p-6">
        <h2 className="text-h3 font-semibold text-foreground">{t("ctaTitle")}</h2>
        <p className="mt-2 text-small text-muted-foreground">{t("ctaBody")}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/source">{t("ctaRequest")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/vehicles">{t("ctaBrowse")}</Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}
