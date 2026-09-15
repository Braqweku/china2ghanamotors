import type { Metadata } from "next";
import { SourcingWizard } from "@/components/source/sourcing-wizard";

export const metadata: Metadata = {
  title: "Source My Vehicle",
  description:
    "Tell us the vehicle you want, your budget and specifications — we'll source options from verified suppliers in China and send you a personalized quote.",
};

export default function SourcePage() {
  return <SourcingWizard />;
}
