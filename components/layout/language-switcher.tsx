"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_COOKIE, localeNames, locales, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  id,
  className,
  tone = "dark",
}: {
  id: string;
  className?: string;
  tone?: "dark" | "light";
}) {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function change(next: string) {
    // Saved before navigating so middleware doesn't send the visitor back to the old language.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.replace(`${pathname}${window.location.search}`, { locale: next as Locale });
    });
  }

  return (
    <Select value={locale} onValueChange={change} disabled={isPending}>
      <SelectTrigger
        id={id}
        size="sm"
        aria-label={t("language")}
        className={cn(
          "gap-1.5",
          tone === "light" && "border-white/30 bg-transparent text-white hover:bg-white/10 [&_svg]:!text-white/80",
          className
        )}
      >
        <Languages className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <SelectValue>{localeNames[locale]}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {locales.map((l) => (
          <SelectItem key={l} value={l} lang={l}>
            {localeNames[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
