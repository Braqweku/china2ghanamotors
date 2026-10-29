const brands = [
  { name: "Honda", logo: "/brands/honda.svg" },
  { name: "Toyota", logo: "/brands/toyota.svg" },
  { name: "BYD", logo: "/brands/byd.svg" },
  { name: "Geely", logo: "/brands/geely.svg" },
  { name: "Hyundai", logo: "/brands/hyundai.svg" },
  { name: "Lexus", logo: null },
  { name: "Great Wall", logo: null },
  { name: "Mazda", logo: "/brands/mazda.svg" },
  { name: "Chery", logo: "/brands/chery.svg" },
  { name: "Nissan", logo: "/brands/nissan.svg" },
  { name: "Kia", logo: "/brands/kia.svg" },
  { name: "iCAR", logo: null },
];

export function TopBrands() {
  const track = [...brands, ...brands];

  return (
    <section className="border-b border-border bg-card py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-label font-medium uppercase tracking-wide text-muted-foreground">
          Brands in our current stock
        </p>
      </div>
      <div
        className="group relative mt-6 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max animate-[marquee-scroll_32s_linear_infinite] group-hover:[animation-play-state:paused]">
          {track.map((brand, i) => (
            <span
              key={`${brand.name}-${i}`}
              className="flex shrink-0 items-center gap-2.5 px-8 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            >
              {brand.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logo}
                  alt=""
                  aria-hidden="true"
                  className="h-7 w-auto max-w-[88px] object-contain"
                />
              ) : null}
              <span className="text-h3 font-semibold tracking-tight text-foreground">
                {brand.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
