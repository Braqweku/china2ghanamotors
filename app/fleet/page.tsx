import type { Metadata } from "next";
import { FleetEnquiryForm } from "@/components/fleet/fleet-enquiry-form";
import { PageHeader } from "@/components/layout/page-header";
import { AsideSection, FormPage } from "@/components/layout/form-page";
import { NextSteps } from "@/components/layout/next-steps";

export const metadata: Metadata = {
  title: "Fleet & Corporate Sourcing",
  description:
    "Vehicle sourcing for ride-hailing operators, logistics businesses, dealers, corporate organisations and institutions — sourced, verified, shipped and delivered from China to Ghana.",
  alternates: { canonical: "/fleet" },
};

const audiences = [
  "Ride-hailing operators and drivers",
  "Logistics and transport businesses",
  "Car dealers sourcing in bulk",
  "Corporate organisations and institutions",
];

const included = [
  "Sourcing across multiple suppliers for the volume you need",
  "Inspection of every unit before purchase",
  "Consolidated shipping, customs and clearing",
  "One point of contact and a tracking reference per order",
];

export default function FleetPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Fleet and corporate sourcing"
        intro="Tell us what your fleet needs. We source, inspect, ship and clear the vehicles, and follow up with options and a quote."
      />

      <FormPage
        aside={
          <>
            <AsideSection title="Who this is for">
              <ul className="flex flex-col gap-2">
                {audiences.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </AsideSection>
            <AsideSection title="What's included">
              <ul className="flex list-disc flex-col gap-2 pl-4">
                {included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </AsideSection>
            <AsideSection title="What happens next">
              <NextSteps
                steps={[
                  "We review your request and confirm requirements",
                  "You receive vehicle options and a quote",
                  "Each vehicle is inspected before purchase",
                  "Vehicles are shipped, cleared and delivered",
                ]}
              />
            </AsideSection>
          </>
        }
      >
        <FleetEnquiryForm />
      </FormPage>
    </div>
  );
}
