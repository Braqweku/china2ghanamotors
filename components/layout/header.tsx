"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
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
  { href: "/vehicles", label: "Vehicles" },
  { href: "/source", label: "Source My Vehicle" },
  { href: "/track", label: "Track" },
  { href: "/fleet", label: "Fleet" },
  { href: "/ev", label: "EV" },
  { href: "/insights", label: "Insights" },
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
          <SheetContent side="right">
            <SheetTitle>Menu</SheetTitle>
            <nav className="mt-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link href={link.href} className="text-base font-medium">
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4"
                >
                  <Button className="w-full">Chat with a Sourcing Specialist</Button>
                </a>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
