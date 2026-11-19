import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/site/section-heading";
import { Slider } from "@/components/site/slider";

// Partner photos are 4:3, so 4:3 cards show the whole vehicle.
const types = [
  { key: "all", href: "/vehicles", image: "/vehicles/veh_157/veh_157_03.jpg" },
  { key: "sedan", href: "/vehicles?vehicleType=sedan", image: "/vehicles/veh_166/veh_166_03.jpg" },
  { key: "suv", href: "/vehicles?vehicleType=suv", image: "/vehicles/veh_163/veh_163_01.jpg" },
  { key: "mpv", href: "/vehicles?vehicleType=mpv", image: "/vehicles/veh_101/veh_101_01.jpg" },
  { key: "ev", href: "/ev", image: "/vehicles/veh_158/veh_158_01.jpg" },
  { key: "pickup", href: "/vehicles?vehicleType=pickup", image: "/vehicles/veh_111/veh_111_01.jpg" },
] as const;

export function VehicleTypes() {
  const t = useTranslations("home");
  const tLabels = useTranslations("labels.bodyType");

  const label = (key: (typeof types)[number]["key"]) =>
    key === "all" ? t("typesAll") : key === "ev" ? t("typesEv") : tLabels(key);

  return (
    <section className="py-24">
      <Slider
        label={t("typesLabel")}
        previousLabel={t("previous")}
        nextLabel={t("next")}
        heading={<SectionHeading label={t("typesLabel")} title={t("typesTitle")} />}
      >
        {types.map((type) => (
          <Link
            key={type.key}
            href={type.href}
            className="group relative aspect-[4/3] w-[78vw] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-[360px]"
          >
            <Image
              src={type.image}
              alt=""
              fill
              sizes="(min-width: 640px) 360px, 78vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
            />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
            <span className="absolute bottom-4 left-4 text-body font-medium text-white">{label(type.key)}</span>
          </Link>
        ))}
      </Slider>
    </section>
  );
}
