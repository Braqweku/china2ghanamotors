import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PhotoBand } from "@/components/site/photo-band";

export function CtaBand() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");

  return (
    <PhotoBand
      src="/stock/cta-car-carrier.jpg"
      alt={t("ctaAlt")}
      overlay="full"
      className="min-h-[480px] lg:min-h-[560px]"
      contentClassName="min-h-[480px] justify-start pt-16 lg:min-h-[560px] lg:pt-20"
    >
      <h2 className="max-w-xl text-h1 font-medium text-white">{t("ctaTitle")}</h2>
      <p className="mt-4 max-w-md text-body text-white/80">{t("ctaBody")}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" variant="light">
          <Link href="/vehicles">{t("ctaBrowse")}</Link>
        </Button>
        <Button asChild size="lg" variant="outline-light">
          <Link href="/source">{tNav("requestVehicle")}</Link>
        </Button>
      </div>
    </PhotoBand>
  );
}
