import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteLink } from "./SiteLink";
import { backgroundsQuery, fallbackSettings, settingsQuery } from "@/lib/site-content";

export function HeroSection() {
  const { data: settingsData } = useQuery(settingsQuery);
  const { data: mediaData } = useQuery(backgroundsQuery);
  const settings = settingsData ?? fallbackSettings;

  const media = useMemo(() => (mediaData ?? []).filter((item) => item.is_active), [mediaData]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (media.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % media.length);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [media.length]);

  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden pt-28">
      <div className="absolute inset-0 -z-20 bg-black">
        {media.map((item, itemIndex) => (
          <div
            key={item.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: itemIndex === index % Math.max(media.length, 1) ? 1 : 0 }}
          >
            {item.media_type === "video" ? (
              <video
                src={item.url}
                autoPlay
                muted
                loop
                playsInline
                className="size-full object-cover"
              />
            ) : (
              <img
                src={item.url}
                alt=""
                aria-hidden="true"
                className="size-full object-cover"
                fetchPriority={itemIndex === 0 ? "high" : "low"}
              />
            )}
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0 -z-10"
        style={{ backgroundImage: "var(--gradient-fade)" }}
        aria-hidden="true"
      />
      <div className="grid-lines absolute inset-0 -z-10 opacity-60" aria-hidden="true" />

      <div className="mx-auto w-full max-w-7xl px-5 pb-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
            Pal Inc — infrastructure
          </p>
          <h1 className="text-gradient text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
            {settings.motto}
          </h1>
          {settings.hero_subtitle ? (
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {settings.hero_subtitle}
            </p>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button variant="hero" size="xl" asChild>
              <SiteLink href={settings.primary_cta_url || "#"}>
                {settings.primary_cta_label}
                <ArrowRight className="size-4" />
              </SiteLink>
            </Button>
            <Button variant="line" size="xl" asChild>
              <SiteLink href={settings.secondary_cta_url || "#"}>
                {settings.secondary_cta_label}
              </SiteLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}