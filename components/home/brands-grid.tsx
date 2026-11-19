import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/site/section-heading";

// Brands currently in stock; logos where we have a clean SVG.
const brands = [
  { name: "Toyota", logo: "/brands/toyota.svg" },
  { name: "Honda", logo: "/brands/honda.svg" },
  { name: "BYD", logo: "/brands/byd.svg" },
  { name: "Geely", logo: "/brands/geely.svg" },
  { name: "Hyundai", logo: "/brands/hyundai.svg" },
  { name: "Lexus", logo: null },
  { name: "Mazda", logo: "/brands/mazda.svg" },
  { name: "Nissan", logo: "/brands/nissan.svg" },
  { name: "Chery", logo: "/brands/chery.svg" },
  { name: "Kia", logo: "/brands/kia.svg" },
  { name: "Great Wall", logo: null },
  { name: "iCAR", logo: null },
];

export function BrandsGrid() {
  const t = useTranslations("home");

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading align="center" label={t("brandsLabel")} title={t("brandsTitle")} />
      <ul className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <li
            key={brand.name}
            className="-mt-px -ml-px flex h-28 items-center justify-center gap-2.5 border border-border sm:h-36"
          >
            {brand.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logo} alt="" aria-hidden="true" className="h-6 w-auto max-w-[72px] object-contain grayscale" />
            )}
            <span className="text-body font-medium tracking-tight text-foreground">{brand.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
