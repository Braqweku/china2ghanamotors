import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = siteConfig.name;
const SITE_DESCRIPTION =
  "Source, verify, ship and clear vehicles from trusted suppliers in China — delivered to Ghana. Sedans, SUVs, pickups and EVs, with a personalized quote for every request.";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo/china2ghana-logo.png`,
  image: `${siteConfig.url}/opengraph-image.png`,
  description: SITE_DESCRIPTION,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.contactEmail,
      areaServed: "GH",
      availableLanguage: ["English"],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${SITE_NAME} | Import Vehicles from China to Ghana`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "import cars from China to Ghana",
    "vehicle sourcing Ghana",
    "buy cars in Ghana",
    "China to Ghana motors",
    "electric vehicles Ghana",
    "car shipping Ghana",
  ],
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Import Vehicles from China to Ghana`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Import Vehicles from China to Ghana`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
