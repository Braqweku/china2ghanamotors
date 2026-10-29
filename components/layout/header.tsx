"use client";

import Link from "next/link";
import { Menu, Car, Search, MapPin, Building2, Zap, BookOpen } from "lucide-react";
import { Logo } from "@/components/layout/logo";
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
  { href: "/vehicles", label: "Vehicles", icon: Car },
  { href: "/ev", label: "EV", icon: Zap },
  { href: "/fleet", label: "Fleet", icon: Building2 },
  { href: "/source", label: "Source a Vehicle", icon: Search },
  { href: "/track", label: "Track", icon: MapPin },
  { href: "/insights", label: "Insights", icon: BookOpen },
];

export function Header() {
  const whatsappHref = buildWhatsAppLink(
    `Hi ${siteConfig.name}, I'd like to speak with a sourcing specialist.`
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm text-sm font-medium whitespace-nowrap text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild>
            <Link href="/source">Request a vehicle</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
            <SheetTitle className="sr-only">Menu</SheetTitle>

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
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            <div className="flex flex-col gap-2 border-t border-border p-4">
              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link href="/source">Request a vehicle</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild variant="outline" className="w-full">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    WhatsApp us
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
