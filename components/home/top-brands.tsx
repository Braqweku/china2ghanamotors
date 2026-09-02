const brands = [
  "BYD",
  "Geely",
  "Chery",
  "Haval",
  "MG",
  "Wuling",
  "JAC",
  "Changan",
  "GAC",
  "Dongfeng",
  "FAW",
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
              key={`${brand}-${i}`}
              className="flex shrink-0 items-center px-8 text-h3 font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
