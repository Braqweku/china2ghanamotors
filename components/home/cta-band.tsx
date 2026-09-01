import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, siteConfig } from "@/lib/config";

export function CtaBand() {
  const whatsappHref = buildWhatsAppLink(
    `Hi ${siteConfig.name}, I'd like to speak with a sourcing specialist.`
  );

  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-h2 font-semibold">Ready to start?</h2>
        <p className="mt-3 text-body text-primary-foreground/80">
          Tell us what you need, or talk to a sourcing specialist directly.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" variant="secondary">
            <Link href="/source">Source My Vehicle</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Chat with a Sourcing Specialist
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
