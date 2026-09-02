import { Hero } from "@/components/home/hero";
import { TopBrands } from "@/components/home/top-brands";
import { HotDeals } from "@/components/home/hot-deals";
import { TrustLayer } from "@/components/home/trust-layer";
import { Journey } from "@/components/home/journey";
import { CtaBand } from "@/components/home/cta-band";
import { getVehicles } from "@/lib/data/vehicles";

const DEAL_VEHICLE_IDS = ["veh_002", "veh_010", "veh_006", "veh_004", "veh_011", "veh_007"];

export default async function Home() {
  const vehicles = await getVehicles();
  const dealVehicles = DEAL_VEHICLE_IDS.map((id) =>
    vehicles.find((v) => v.id === id)
  ).filter((v): v is NonNullable<typeof v> => v !== undefined);

  return (
    <>
      <Hero />
      <TopBrands />
      <HotDeals vehicles={dealVehicles} />
      <TrustLayer />
      <Journey />
      <CtaBand />
    </>
  );
}
