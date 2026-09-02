const brands = [
  { name: "BYD", logo: "/brands/byd.svg" },
  { name: "Geely", logo: "/brands/geely.svg" },
  { name: "Chery", logo: "/brands/chery.svg" },
  { name: "Haval", logo: "/brands/haval.svg" },
  { name: "MG", logo: "/brands/mg.svg" },
  { name: "Wuling", logo: "/brands/wuling.svg" },
  { name: "JAC", logo: "/brands/jac.png" },
  { name: "Changan", logo: "/brands/changan.svg" },
  { name: "GAC", logo: "/brands/gac.svg" },
  { name: "Dongfeng", logo: "/brands/dongfeng.svg" },
  { name: "FAW", logo: null },
];

export function TopBrands() {
  const track = [...brands, ...brands];

  return (
    <section className="border-b border-border bg-card py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-label font-medium uppercase tracking-wide text-muted-foreground">
          Sourcing from China&apos;s leading brands
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
