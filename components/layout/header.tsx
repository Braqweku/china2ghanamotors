"use client";

import { useTranslations } from "next-intl";
import { Menu, Car, Ship, MapPin, Building2, Zap, BookOpen } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { ContactBar } from "@/components/layout/contact-bar";
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
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/vehicles", key: "vehicles", icon: Car },
  { href: "/ev", key: "ev", icon: Zap },
  { href: "/shipping-cars-from-china-to-ghana", key: "shipping", icon: Ship },
  { href: "/fleet", key: "fleet", icon: Building2 },
  { href: "/track", key: "track", icon: MapPin },
  { href: "/insights", key: "insights", icon: BookOpen },
] as const;

export function Header({ showLanguageSwitcher = true }: { showLanguageSwitcher?: boolean }) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const whatsappHref = buildWhatsAppLink(tCommon("whatsappGreeting", { name: siteConfig.name }));
  // On the homepage the header floats over the hero photo, as on DriveHub.
  const overlay = pathname === "/";

  const bar = (
    <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 lg:h-[4.5rem] lg:grid-cols-[1fr_auto_1fr] lg:px-8">
      <Logo tone={overlay ? "light" : "dark"} />

      <nav className="hidden items-center gap-7 lg:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-sm text-[0.9375rem] font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2",
              overlay
                ? "text-white/90 hover:text-white focus-visible:ring-white"
                : "text-foreground/80 hover:text-foreground focus-visible:ring-ring"
            )}
          >
            {t(link.key)}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-end gap-3">
        <div className="hidden items-center gap-3 lg:flex">
          {showLanguageSwitcher && <LanguageSwitcher id="language-desktop" tone={overlay ? "light" : "dark"} />}
          <Button asChild variant={overlay ? "light" : "default"}>
            <Link href="/source">{t("requestVehicle")}</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("lg:hidden", overlay && "text-white hover:bg-white/10 hover:text-white")}
              aria-label={t("openMenu")}
            >
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
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-body font-medium text-foreground transition-colors hover:bg-muted"
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
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-x-0 top-0 z-40">
        <ContactBar overlay />
        <header className="border-b border-white/15">{bar}</header>
      </div>
    );
  }

  return (
    <>
      <ContactBar />
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">{bar}</header>
    </>
  );
}
