import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Logo() {
  const t = useTranslations("common");

  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={t("logoHome")}>
      <Image
        src="/logo/china2ghana-logo-transparent.png"
        alt="China2Ghana Motors"
        width={1020}
        height={530}
        className="h-10 w-auto"
        priority
      />
    </Link>
  );
}
