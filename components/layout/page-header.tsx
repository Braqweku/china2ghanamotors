import type { ReactNode } from "react";

export function PageHeader({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header>
      <h1 className="text-h1 font-semibold tracking-tight text-foreground">{title}</h1>
      {intro && <p className="mt-2 max-w-2xl text-body text-muted-foreground">{intro}</p>}
      {children}
    </header>
  );
}
