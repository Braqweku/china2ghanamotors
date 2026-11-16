import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { buildWhatsAppLink, siteConfig } from "@/lib/config";

const exploreLinks = [
  { href: "/vehicles", key: "vehicles" },
  { href: "/shipping-cars-from-china-to-ghana", key: "shipping" },
  { href: "/ev", key: "ev" },
  { href: "/source", key: "source" },
  { href: "/track", key: "track" },
] as const;

const companyLinks = [
  { href: "/fleet", key: "fleet" },
  { href: "/insights", key: "insights" },
  { href: "/faq", key: "faq" },
] as const;

const linkClass = "text-small text-muted-foreground transition-colors hover:text-foreground";

export function Footer({ showLanguageSwitcher = true }: { showLanguageSwitcher?: boolean }) {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const whatsappHref = buildWhatsAppLink(tCommon("whatsappGreeting", { name: siteConfig.name }));

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Image
              src="/logo/china2ghana-logo-transparent.png"
              alt="China2Ghana Motors"
              width={1020}
              height={530}
              className="h-8 w-auto"
            />
            <p className="mt-2 text-small text-muted-foreground">{tCommon("tagline")}</p>
            {showLanguageSwitcher && (
              <LanguageSwitcher id="language-footer" className="mt-4 w-40 bg-background" />
            )}
          </div>

          <div>
            <p className="text-label font-semibold tracking-wide text-foreground uppercase">
              {t("explore")}
            </p>
            <ul className="mt-3 space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-label font-semibold tracking-wide text-foreground uppercase">
              {t("company")}
            </p>
            <ul className="mt-3 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-label font-semibold tracking-wide text-foreground uppercase">
              {t("contact")}
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={`mailto:${siteConfig.contactEmail}`} className={linkClass}>
                  {siteConfig.contactEmail}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.infoEmail}`} className={linkClass}>
                  {siteConfig.infoEmail}
                </a>
              </li>
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {t("whatsapp")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t border-border pt-5 text-caption text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}
          </p>
          <p>{tCommon("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
