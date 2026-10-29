import type { ReactNode } from "react";

export function FormPage({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
      <div className="min-w-0 rounded-lg border border-border bg-card p-5 sm:p-8">{children}</div>
      <aside className="flex flex-col gap-8 lg:pt-2">{aside}</aside>
    </div>
  );
}

export function AsideSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-small font-semibold text-foreground">{title}</h2>
      <div className="mt-3 text-small text-muted-foreground">{children}</div>
    </section>
  );
}
