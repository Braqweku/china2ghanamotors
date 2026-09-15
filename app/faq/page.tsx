import type { Metadata } from "next";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about sourcing, shipping, tracking and importing a vehicle from China to Ghana with China2Ghana Motors.",
};

type Faq = {
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

const faqs: Faq[] = [
  {
    question: "How does vehicle sourcing work?",
    answer:
      "You tell us what you're looking for — vehicle type, budget and any must-have specifications. We identify matching options from verified suppliers in China, the vehicle is inspected and verified before purchase, and we then arrange shipping and customs clearing to Ghana.",
    link: { href: "/source", label: "Start a sourcing request" },
  },
  {
    question: "How long does shipping take?",
    answer:
      "It depends on the specific vehicle, the shipping method (RoRo or container) and the route, so we don't quote a single fixed timeline. Once a vehicle is selected, we give you an estimate specific to your request.",
    link: { href: "/insights/understanding-vehicle-shipping", label: "RoRo vs container shipping, explained" },
  },
  {
    question: "Can I get a price before I commit to anything?",
    answer:
      "Pricing depends on the vehicle's specification, shipping and current exchange rates, so we don't list fixed prices on the site. Reach out via Source My Vehicle, WhatsApp or email and we'll follow up with a full quote for your specific request.",
  },
  {
    question: "Can I track my order after I submit a request?",
    answer:
      "Yes. Every fleet or sourcing request gets a tracking reference, shown on screen when you submit and emailed to you if you provide an address. Enter it on the Track page to see its current status.",
    link: { href: "/track", label: "Track an order" },
  },
  {
    question: "Do you source electric and hybrid vehicles?",
    answer:
      "Yes. Electric and hybrid vehicles sourced from China, with range, battery and charging details available for each model.",
    link: { href: "/ev", label: "Electric & Hybrid vehicles" },
  },
  {
    question: "What documents do I need to import a vehicle?",
    answer:
      "Requirements depend on your specific vehicle and situation. We handle documentation and customs clearing on your behalf as part of the import process.",
    link: { href: "/insights/clearing-customs-ghana", label: "Clearing a vehicle through Ghanaian customs" },
  },
  {
    question: "Is every vehicle inspected before it ships?",
    answer:
      "Yes. Vehicles go through inspection and verification before any purchase is finalized, confirming the vehicle's actual condition and specifications match what was represented.",
  },
  {
    question: "Do you source vehicles for businesses and fleets, not just individuals?",
    answer:
      "Yes. We work with ride-hailing operators, logistics businesses, dealers, corporate organisations and institutions.",
    link: { href: "/fleet", label: "Fleet & Corporate Sourcing" },
  },
  {
    question: "Are the vehicles new or used?",
    answer:
      "Both. You can filter by condition on the Vehicles page, and specify your preference when submitting a sourcing request.",
    link: { href: "/vehicles", label: "Browse vehicles" },
  },
  {
    question: "How do I get in touch with a sourcing specialist?",
    answer: `Through the Source My Vehicle form, WhatsApp, or by email at ${siteConfig.contactEmail}.`,
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="text-h1 font-semibold text-foreground">Frequently Asked Questions</h1>
      <p className="mt-2 text-body text-muted-foreground">
        Common questions about sourcing, shipping, tracking and importing a vehicle from
        China to Ghana.
      </p>

      <div className="mt-10 space-y-8">
        {faqs.map((faq, i) => (
          <div key={faq.question}>
            <h2 className="text-h3 font-semibold text-foreground">{faq.question}</h2>
            <p className="mt-2 text-body text-muted-foreground">{faq.answer}</p>
            {faq.link && (
              <Link href={faq.link.href} className="mt-2 inline-block text-small text-accent underline">
                {faq.link.label}
              </Link>
            )}
            {i < faqs.length - 1 && <Separator className="mt-8" />}
          </div>
        ))}
      </div>
    </div>
  );
}
