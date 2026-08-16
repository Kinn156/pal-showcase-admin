import { useQuery } from "@tanstack/react-query";
import { Globe, Lock, Zap } from "lucide-react";

import { fallbackSettings, settingsQuery } from "@/lib/site-content";

const pillars = [
  {
    icon: Globe,
    title: "Open by default",
    body: "Documented primitives, portable formats, and exports that actually work.",
  },
  {
    icon: Lock,
    title: "Private by design",
    body: "Your data stays yours, isolated per tenant and encrypted end to end.",
  },
  {
    icon: Zap,
    title: "Fast as a requirement",
    body: "Sub-50ms cold starts across 40 regions — performance is not a paid tier.",
  },
];

export function AboutSection() {
  const { data } = useQuery(settingsQuery);
  const settings = data ?? fallbackSettings;

  return (
    <section id="about" className="relative border-t border-border bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              About Pal Inc
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              {settings.about_heading || "Infrastructure without gatekeepers"}
            </h2>
          </div>
          <div>
            <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg">
              {settings.about_body}
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="surface-card rounded-xl p-5">
                  <pillar.icon className="size-4 text-brand" />
                  <h3 className="mt-4 text-sm font-medium text-foreground">{pillar.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{pillar.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}