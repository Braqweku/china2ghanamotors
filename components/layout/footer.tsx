import Link from "next/link";
import Image from "next/image";
import { buildWhatsAppLink, siteConfig } from "@/lib/config";

const exploreLinks = [
  { href: "/vehicles", label: "Vehicles" },
  { href: "/ev", label: "Electric & Hybrid" },
  { href: "/source", label: "Source My Vehicle" },
  { href: "/track", label: "Track an Order" },
];

const companyLinks = [
  { href: "/fleet", label: "Corporate & Fleet" },
  { href: "/insights", label: "Insights" },
];

export function Footer() {
  const whatsappHref = buildWhatsAppLink(
    `Hi ${siteConfig.name}, I'd like to speak with a sourcing specialist.`
  );

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Image
              src="/logo/china2ghana-logo.png"
              alt="China2Ghana Motors"
              width={1027}
              height={537}
              className="h-9 w-auto"
            />
            <p className="mt-4 text-small text-muted-foreground">{siteConfig.tagline}</p>
          </div>

          <div>
            <p className="text-label font-semibold tracking-wide text-foreground uppercase">
              Explore
            </p>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-small text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-label font-semibold tracking-wide text-foreground uppercase">
              Company
            </p>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-small text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-label font-semibold tracking-wide text-foreground uppercase">
              Contact
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-small text-muted-foreground transition-colors hover:text-foreground"
                >
                  {siteConfig.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-small text-muted-foreground transition-colors hover:text-foreground"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-caption text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
