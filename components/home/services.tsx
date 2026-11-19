import { useTranslations } from "next-intl";
import { ArrowRight, Building2, Search, Ship } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/site/section-heading";
import { SHIPPING_PATH } from "@/lib/seo/llms";

const services = [
  { key: "sourcing", icon: Search, href: "/source" },
  { key: "shipping", icon: Ship, href: SHIPPING_PATH },
  { key: "fleet", icon: Building2, href: "/fleet" },
] as const;

export function Services() {
  const t = useTranslations("home");

  return (
    <section className="pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading label={t("servicesLabel")} title={t("servicesTitle")} />
      </div>
      <ul className="mt-12 grid border-y border-border md:grid-cols-3">
        {services.map((service, i) => (
          <li
            key={service.key}
            className={i > 0 ? "border-t border-border md:border-t-0 md:border-l" : undefined}
          >
            <div className="mx-auto flex h-full max-w-md flex-col px-4 py-10 sm:px-6 md:max-w-none lg:px-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background">
                <service.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-body font-medium text-foreground">{t(`services.${service.key}Title`)}</h3>
              <p className="mt-2 max-w-sm flex-1 text-small text-muted-foreground">{t(`services.${service.key}Body`)}</p>
              <Link
                href={service.href}
                className="group mt-6 inline-flex items-center gap-1.5 self-start text-small font-medium text-foreground underline-offset-4 hover:underline"
              >
                {t("services.exploreMore")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
