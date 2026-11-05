import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/locales";
import { SourcingWizard } from "@/components/source/sourcing-wizard";
import { PageHeader } from "@/components/layout/page-header";
import { AsideSection, FormPage } from "@/components/layout/form-page";
import { NextSteps } from "@/components/layout/next-steps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "source" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/source", locale),
  };
}

export default async function SourcePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("source");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title={t("title")} intro={t("intro")} />

      <FormPage
        aside={
          <>
            <AsideSection title={t("afterTitle")}>
              <NextSteps steps={t.raw("afterSteps") as string[]} />
            </AsideSection>
            <AsideSection title={t("knowTitle")}>
              <p>{t("knowBody")}</p>
              <Link
                href="/vehicles"
                className="mt-3 inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
              >
                {t("browse")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </AsideSection>
          </>
        }
      >
        <SourcingWizard />
      </FormPage>
    </div>
  );
}
