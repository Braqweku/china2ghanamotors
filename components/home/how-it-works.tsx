import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/site/section-heading";
import { Slider } from "@/components/site/slider";

// One photo per step; partner photos for sourcing and inspection, port photo for shipping.
const stepImages = [
  { src: "/vehicles/veh_166/veh_166_03.jpg", alt: "" },
  { src: "/vehicles/veh_157/veh_157_03.jpg", alt: "" },
  { src: "/stock/step-ship.jpg", alt: "stepShipAlt" },
  { src: "/vehicles/veh_163/veh_163_01.jpg", alt: "" },
];

/** Same look as DriveHub's review slider, used for the import steps until we have real reviews. */
export function HowItWorks() {
  const t = useTranslations("home");
  const steps = t.raw("how") as { title: string; body: string }[];

  return (
    <section className="py-24">
      <Slider
        label={t("howLabel")}
        previousLabel={t("previous")}
        nextLabel={t("next")}
        heading={<SectionHeading label={t("howLabel")} title={t("howTitle")} />}
      >
        {steps.map((step, i) => (
          <article
            key={step.title}
            className="relative aspect-[4/3] w-[85vw] max-w-[480px] shrink-0 snap-start overflow-hidden rounded-lg bg-[#070707] sm:w-[440px]"
          >
            <Image
              src={stepImages[i].src}
              alt={stepImages[i].alt ? t(stepImages[i].alt) : ""}
              fill
              sizes="(min-width: 640px) 440px, 85vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-small text-white/70">{t("howStep", { n: i + 1 })}</p>
              <h3 className="mt-1 text-h3 font-medium text-white">{step.title}</h3>
              <p className="mt-2 max-w-sm text-small text-white/80">{step.body}</p>
            </div>
          </article>
        ))}
      </Slider>
    </section>
  );
}
