"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ReferenceLookupForm({ defaultValue }: { defaultValue?: string }) {
  const t = useTranslations("track");
  const router = useRouter();
  const [value, setValue] = useState(defaultValue ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/track?ref=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md gap-2">
      <Input
        placeholder={t("inputPlaceholder")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="font-mono"
        aria-label={t("inputLabel")}
      />
      <Button type="submit">{t("submit")}</Button>
    </form>
  );
}
