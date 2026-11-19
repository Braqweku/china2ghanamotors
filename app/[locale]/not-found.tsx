import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-h1 font-medium text-foreground">{t("errors.notFoundTitle")}</h1>
      <p className="text-body text-muted-foreground">{t("errors.notFoundBody")}</p>
      <Button asChild>
        <Link href="/">{t("common.backHome")}</Link>
      </Button>
    </div>
  );
}
