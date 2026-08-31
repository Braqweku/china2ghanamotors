import { Hero } from "@/components/home/hero";
import { TrustLayer } from "@/components/home/trust-layer";
import { Journey } from "@/components/home/journey";
import { CtaBand } from "@/components/home/cta-band";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustLayer />
      <Journey />
      <CtaBand />
    </>
  );
}
