import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/lib/config";
import { bodyClassName } from "@/lib/fonts";
import { alternatesFor } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/locales";
import { organizationSchema, websiteSchema } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { routing } from "@/i18n/routing";

const ogLocale: Record<Locale, string> = { en: "en_GH", fr: "fr_FR", pt: "pt_PT", zh: "zh_CN" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("siteTitle"), template: `%s | ${siteConfig.name}` },
    description: t("siteDescription"),
    alternates: alternatesFor("/", locale),
    openGraph: {
      type: "website",
      locale: ogLocale[locale],
      siteName: siteConfig.name,
      title: t("siteTitle"),
      description: t("siteDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteTitle"),
      description: t("siteDescription"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("meta");

  return (
    <html lang={locale}>
      <body className={bodyClassName}>
        <NextIntlClientProvider>
          <JsonLd data={organizationSchema(t("siteDescription"))} />
          <JsonLd data={websiteSchema(locale)} />
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
