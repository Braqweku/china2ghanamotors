import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

/** Full-bleed photo hero; the header floats over it (see Header `overlay`). */
export function Hero() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");

  return (
    <section className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-[#070707] lg:min-h-[min(100svh,860px)] lg:items-center">
      <Image
        src="/stock/hero-car-carrier.jpg"
        alt={t("heroAlt")}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[70%_center]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-4 pt-40 pb-16 sm:px-6 lg:px-8 lg:pt-32 lg:pb-0">
        <h1 className="max-w-2xl text-display font-medium text-white">{t("title")}</h1>
        <p className="mt-6 max-w-lg text-body text-white/80">{t("body")}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="light">
            <Link href="/vehicles">{t("exploreCta")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline-light">
            <Link href="/source">{tNav("requestVehicle")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
