import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternatesFor } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/locales";
import { FleetEnquiryForm } from "@/components/fleet/fleet-enquiry-form";
import { PageHeader } from "@/components/layout/page-header";
import { AsideSection, FormPage } from "@/components/layout/form-page";
import { NextSteps } from "@/components/layout/next-steps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fleet" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/fleet", locale),
  };
}

export default async function FleetPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("fleet");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title={t("title")} intro={t("intro")} />

      <FormPage
        aside={
          <>
            <AsideSection title={t("whoTitle")}>
              <ul className="flex flex-col gap-2">
                {(t.raw("audiences") as string[]).map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </AsideSection>
            <AsideSection title={t("includedTitle")}>
              <ul className="flex list-disc flex-col gap-2 pl-4">
                {(t.raw("included") as string[]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </AsideSection>
            <AsideSection title={t("nextTitle")}>
              <NextSteps steps={t.raw("nextSteps") as string[]} />
            </AsideSection>
          </>
        }
      >
        <FleetEnquiryForm />
      </FormPage>
    </div>
  );
}
