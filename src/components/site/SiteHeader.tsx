import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu, X, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { SiteLink } from "./SiteLink";
import { fallbackSettings, settingsQuery } from "@/lib/site-content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data } = useQuery(settingsQuery);
  const settings = data ?? fallbackSettings;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {settings.announcement_visible && settings.announcement_text ? (
        <SiteLink
          href={settings.announcement_url || "#"}
          className="flex items-center justify-center gap-2 border-b border-border bg-white/[0.04] px-4 py-2 text-center text-xs text-muted-foreground backdrop-blur-xl transition-colors hover:text-foreground"
        >
          <span>{settings.announcement_text}</span>
          <ArrowUpRight className="size-3" />
        </SiteLink>
      ) : null}

      <div className="border-b border-border bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <SiteLink href="/" className="shrink-0">
            <Logo />
          </SiteLink>

          <nav className="hidden items-center gap-7 lg:flex">
            {settings.nav_links.map((link) => (
              <SiteLink
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </SiteLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="line" size="sm" asChild>
              <SiteLink href={settings.secondary_cta_url || "#"}>
                {settings.secondary_cta_label}
              </SiteLink>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <SiteLink href={settings.primary_cta_url || "#"}>{settings.primary_cta_label}</SiteLink>
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
          >
            {open ? <Menu className="size-4 hidden" /> : null}
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-border bg-black/90 px-5 pb-6 pt-3 backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col">
              {settings.nav_links.map((link) => (
                <SiteLink
                  key={link.label}
                  href={link.href}
                  className="border-b border-border py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </SiteLink>
              ))}
            </nav>
            <div className="mt-5 flex flex-col gap-2">
              <Button variant="hero" asChild>
                <SiteLink href={settings.primary_cta_url || "#"}>
                  {settings.primary_cta_label}
                </SiteLink>
              </Button>
              <Button variant="line" asChild>
                <SiteLink href={settings.secondary_cta_url || "#"}>
                  {settings.secondary_cta_label}
                </SiteLink>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}