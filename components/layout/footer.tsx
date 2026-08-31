import Link from "next/link";
import { siteConfig } from "@/lib/config";

const footerLinks = [
  { href: "/vehicles", label: "Vehicles" },
  { href: "/source", label: "Source My Vehicle" },
  { href: "/track", label: "Track an Order" },
  { href: "/fleet", label: "Corporate & Fleet" },
  { href: "/insights", label: "Insights" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{siteConfig.tagline}</p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
          <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-foreground">
            {siteConfig.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
