import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { HeroSlideshow } from "@/components/home/hero-slideshow";

const stats = [
  { value: "15+", key: "statSuppliers" },
  { value: "500+", key: "statSourced" },
  { value: "100%", key: "statInspected" },
] as const;

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative w-full overflow-hidden bg-primary">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="order-last animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 lg:order-none">
          <p className="text-label font-medium uppercase tracking-wide text-accent">{t("eyebrow")}</p>
          <h1 className="mt-4 text-h1 font-semibold tracking-tight text-primary-foreground lg:text-display">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-body text-primary-foreground/85">{t("body")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href="/source">{t("sourceCta")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/vehicles">{t("exploreCta")}</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-primary-foreground/20 pt-6">
            {stats.map((stat) => (
              <div key={stat.key}>
                <p className="text-h3 font-semibold text-primary-foreground">{stat.value}</p>
                <p className="text-small text-primary-foreground/70">{t(stat.key)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="order-first mx-auto w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 delay-150 lg:order-none lg:max-w-none">
          <HeroSlideshow />
        </div>
      </div>
    </section>
  );
}
