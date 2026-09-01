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
  { href: "/source", label: "Source My Vehicle", icon: Search },
  { href: "/track", label: "Track", icon: MapPin },
  { href: "/fleet", label: "Fleet", icon: Building2 },
  { href: "/ev", label: "EV", icon: Zap },
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

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Chat with a Sourcing Specialist
            </a>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
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

            <div className="border-t border-border p-4">
              <SheetClose asChild>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">Chat with a Sourcing Specialist</Button>
                </a>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
