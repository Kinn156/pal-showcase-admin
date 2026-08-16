import type { ReactNode } from "react";

import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-40 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{intro}</p>
        <div className="mt-14 space-y-12">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function Block({
  id,
  heading,
  children,
}: {
  id?: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-border pt-10">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{heading}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}