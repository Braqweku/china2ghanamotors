import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SourcingWizard } from "@/components/source/sourcing-wizard";
import { PageHeader } from "@/components/layout/page-header";
import { AsideSection, FormPage } from "@/components/layout/form-page";
import { NextSteps } from "@/components/layout/next-steps";

export const metadata: Metadata = {
  title: "Source My Vehicle",
  description:
    "Tell us the vehicle you want, your budget and specifications — we'll source options from verified suppliers in China and send you a personalized quote.",
  alternates: { canonical: "/source" },
};

export default function SourcePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Source a vehicle"
        intro="Tell us what you need. We find it, inspect it, ship it and deliver it to you in Ghana."
      />

      <FormPage
        aside={
          <>
            <AsideSection title="What happens after you submit">
              <NextSteps
                steps={[
                  "You get a tracking reference straight away",
                  "We send matching options with a full quote",
                  "The vehicle you choose is inspected before purchase",
                  "We ship, clear and deliver it to you",
                ]}
              />
            </AsideSection>
            <AsideSection title="Already know what you want?">
              <p>Our partner has used vehicles in China ready to inspect and ship.</p>
              <Link
                href="/vehicles"
                className="mt-3 inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
              >
                Browse vehicles available now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </AsideSection>
          </>
        }
      >
        <SourcingWizard />
      </FormPage>
    </div>
  );
}
