import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Brand logo linking home. Use `tone="light"` on photos and dark backgrounds. */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const t = useTranslations("common");

  return (
    <Link href="/" className={cn("flex shrink-0 items-center", className)} aria-label={t("logoHome")}>
      <Image
        src={tone === "light" ? "/logo/china2ghana-logo-white.png" : "/logo/china2ghana-logo-transparent.png"}
        alt="China2Ghana Motors"
        width={1020}
        height={530}
        className="h-10 w-auto"
        priority
      />
    </Link>
  );
}
