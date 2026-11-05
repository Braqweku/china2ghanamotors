import { useLocale, useTranslations } from "next-intl";
import type { Article } from "@/types";
import { localeTags, type Locale } from "@/lib/i18n/locales";

export function ArticleMeta({ article }: { article: Article }) {
  const t = useTranslations("insights");
  const locale = useLocale() as Locale;

  return (
    <p className="text-caption text-muted-foreground">
      <span className="font-medium uppercase tracking-wide text-foreground/70">
        {t(`categories.${article.category}`)}
      </span>
      {" · "}
      {new Date(article.publishedAt).toLocaleDateString(localeTags[locale], {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
      {" · "}
      {t("minRead", { count: article.readMinutes })}
    </p>
  );
}
