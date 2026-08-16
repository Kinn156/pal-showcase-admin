import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Renders an internal router link, or a plain anchor for hashes and external URLs. */
export function SiteLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const isRouterLink = href.startsWith("/") && !href.includes("#");
  if (isRouterLink) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  const isExternal = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={className}
      {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {children}
    </a>
  );
}