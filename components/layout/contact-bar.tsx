import { useTranslations } from "next-intl";
import { Mail, MessageCircle, Ship } from "lucide-react";
import { buildWhatsAppLink, siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

/** Thin strip above the header with ways to reach us, as on DriveHub. */
export function ContactBar({ overlay = false }: { overlay?: boolean }) {
  const t = useTranslations("common");
  const whatsappHref = buildWhatsAppLink(t("whatsappGreeting", { name: siteConfig.name }));

  return (
    <div
      className={cn(
        "border-b text-caption",
        overlay ? "border-white/15 text-white/85" : "border-white/10 bg-[#070707] text-white/80"
      )}
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
        <a href={`mailto:${siteConfig.contactEmail}`} className="flex items-center gap-1.5 hover:text-white">
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{siteConfig.contactEmail}</span>
        </a>
        <span aria-hidden="true" className="h-3 w-px bg-white/20" />
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-white"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
        <span aria-hidden="true" className="hidden h-3 w-px bg-white/20 md:block" />
        <p className="hidden items-center gap-1.5 md:flex">
          <Ship className="h-3.5 w-3.5" aria-hidden="true" />
          {t("shippedToTema")}
        </p>
      </div>
    </div>
  );
}
