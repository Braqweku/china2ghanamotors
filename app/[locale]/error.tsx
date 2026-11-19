"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-medium text-foreground">{t("title")}</h1>
      <p className="text-muted-foreground">{t("body")}</p>
      <Button onClick={() => reset()}>{t("retry")}</Button>
    </div>
  );
}
