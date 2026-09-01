import { FleetEnquiryForm } from "@/components/fleet/fleet-enquiry-form";

export default function FleetPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-h1 font-semibold text-foreground">
        Source Your Next Fleet From China
      </h1>
      <p className="mt-2 text-body text-muted-foreground">
        We source, verify, ship and deliver vehicles for ride-hailing operators,
        logistics businesses, dealers, corporate organisations and institutions —
        tell us what your fleet needs and we&apos;ll follow up with options.
      </p>

      <div className="mt-10">
        <FleetEnquiryForm />
      </div>
    </div>
  );
}
