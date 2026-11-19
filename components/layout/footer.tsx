import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { buildWhatsAppLink, siteConfig } from "@/lib/config";
import { SHIPPING_PATH } from "@/lib/seo/llms";

const exploreLinks = [
  { href: "/vehicles", key: "vehicles" },
  { href: SHIPPING_PATH, key: "shipping" },
  { href: "/ev", key: "ev" },
  { href: "/source", key: "source" },
  { href: "/track", key: "track" },
] as const;

const companyLinks = [
  { href: "/fleet", key: "fleet" },
  { href: "/insights", key: "insights" },
  { href: "/faq", key: "faq" },
] as const;

const linkClass = "text-small text-white/85 transition-colors hover:text-white";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-small text-white/50">{title}</p>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

export function Footer({ showLanguageSwitcher = true }: { showLanguageSwitcher?: boolean }) {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const whatsappHref = buildWhatsAppLink(tCommon("whatsappGreeting", { name: siteConfig.name }));

  return (
    <footer className="overflow-hidden bg-[#070707] text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/logo/china2ghana-logo-white.png"
              alt="China2Ghana Motors"
              width={1020}
              height={530}
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-xs text-small text-white/60">{tCommon("tagline")}</p>
            <p className="mt-1 text-small text-white/60">
              © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}
            </p>
            {showLanguageSwitcher && (
              <LanguageSwitcher id="language-footer" tone="light" className="mt-6 w-40" />
            )}
          </div>

          <Column title={t("explore")}>
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </Column>

          <Column title={t("company")}>
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </Column>

          <Column title={t("contact")}>
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
          </Column>
        </div>
      </div>

      {/* Oversized wordmark, as on DriveHub. Decorative: the logo above already names the company. */}
      <p
        aria-hidden="true"
        className="mt-16 select-none text-center text-[17.5vw] leading-[0.78] font-semibold tracking-[-0.06em] whitespace-nowrap text-white/[0.06]"
      >
        China2Ghana
      </p>
    </footer>
  );
}
