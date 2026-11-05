import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/lib/config";
import { bodyClassName } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `Admin | ${siteConfig.name}`, template: `%s | ${siteConfig.name}` },
  robots: { index: false, follow: false },
};

// Staff area: English only, outside the language routing.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={bodyClassName}>
        <NextIntlClientProvider locale="en">
          <Header showLanguageSwitcher={false} />
          <main>{children}</main>
          <Footer showLanguageSwitcher={false} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
