import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PhotoBand } from "@/components/site/photo-band";
import { SectionHeading } from "@/components/site/section-heading";
import { SHIPPING_PATH } from "@/lib/seo/llms";

export function AboutBand() {
  const t = useTranslations("home");

  return (
    <PhotoBand
      src="/stock/about-port-cars.jpg"
      alt={t("aboutAlt")}
      className="min-h-[360px] lg:min-h-[420px]"
      contentClassName="min-h-[360px] justify-end pb-10 lg:min-h-[420px] lg:pb-12"
    >
      <SectionHeading
        tone="light"
        label={t("aboutLabel")}
        title={t("aboutTitle")}
        intro={t("aboutBody")}
        action={
          <Button asChild variant="light" size="lg">
            <Link href={SHIPPING_PATH}>{t("aboutCta")}</Link>
          </Button>
        }
      />
    </PhotoBand>
  );
}
