"use client";

import { useTranslations } from "next-intl";
import { Menu, Car, Search, MapPin, Building2, Zap, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { siteConfig, buildWhatsAppLink } from "@/lib/config";

const navLinks = [
  { href: "/vehicles", key: "vehicles", icon: Car },
  { href: "/ev", key: "ev", icon: Zap },
  { href: "/fleet", key: "fleet", icon: Building2 },
  { href: "/source", key: "source", icon: Search },
  { href: "/track", key: "track", icon: MapPin },
  { href: "/insights", key: "insights", icon: BookOpen },
] as const;

export function Header({ showLanguageSwitcher = true }: { showLanguageSwitcher?: boolean }) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const whatsappHref = buildWhatsAppLink(tCommon("whatsappGreeting", { name: siteConfig.name }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm text-sm font-medium whitespace-nowrap text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {showLanguageSwitcher && <LanguageSwitcher id="language-desktop" />}
          <Button asChild>
            <Link href="/source">{t("requestVehicle")}</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("openMenu")}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
            <SheetTitle className="sr-only">{t("menu")}</SheetTitle>

            <div className="flex h-16 items-center border-b border-border px-6">
              <Logo />
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-body font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <link.icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    {t(link.key)}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            <div className="flex flex-col gap-2 border-t border-border p-4">
              {showLanguageSwitcher && <LanguageSwitcher id="language-mobile" className="w-full" />}
              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link href="/source">{t("requestVehicle")}</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild variant="outline" className="w-full">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    {t("whatsappUs")}
                  </a>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
