import { Github, Linkedin, MessageCircle, Twitter } from "lucide-react";

import { Logo } from "./Logo";
import { SiteLink } from "./SiteLink";

const columns = [
  {
    title: "Company",
    links: [
      { label: "Company & Investors", href: "/company" },
      { label: "About", href: "/#about" },
      { label: "Careers", href: "/company#careers" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "All products", href: "/#products" },
      { label: "Documentation", href: "/support#docs" },
      { label: "Status", href: "/support#status" },
      { label: "Changelog", href: "/company#changelog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/terms#privacy" },
      { label: "Acceptable Use", href: "/terms#acceptable-use" },
      { label: "DPA", href: "/terms#dpa" },
    ],
  },
];

const socials = [
  { label: "Twitter / X", href: "https://x.com", icon: Twitter },
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "Discord", href: "https://discord.com", icon: MessageCircle },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-black">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The open infrastructure layer for teams that refuse to be locked in.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-white/25 hover:text-foreground"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <SiteLink
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </SiteLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Pal Inc. All rights reserved.
          </p>
          <SiteLink
            href="/admin"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Admin
          </SiteLink>
        </div>
      </div>
    </footer>
  );
}