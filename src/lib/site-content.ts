import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type NavLink = { label: string; href: string };

export type SiteSettings = {
  id: number;
  motto: string;
  hero_subtitle: string;
  announcement_text: string;
  announcement_visible: boolean;
  announcement_url: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  nav_links: NavLink[];
  about_heading: string;
  about_body: string;
};

export type Product = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image_url: string | null;
  video_url: string | null;
  explore_url: string;
  sort_order: number;
  published: boolean;
};

export type BackgroundMedia = {
  id: string;
  label: string;
  media_type: string;
  url: string;
  is_active: boolean;
  sort_order: number;
};

export const fallbackSettings: SiteSettings = {
  id: 1,
  motto: "Freedom of Software",
  hero_subtitle: "",
  announcement_text: "",
  announcement_visible: false,
  announcement_url: "#",
  primary_cta_label: "Join",
  primary_cta_url: "#",
  secondary_cta_label: "Talk to team",
  secondary_cta_url: "#",
  nav_links: [
    { label: "Company & Investors", href: "/company" },
    { label: "Products", href: "/#products" },
    { label: "Terms & Policy", href: "/terms" },
    { label: "Support", href: "/support" },
  ],
  about_heading: "",
  about_body: "",
};

function normalizeNavLinks(value: unknown): NavLink[] {
  if (!Array.isArray(value)) return fallbackSettings.nav_links;
  return value
    .filter((entry): entry is NavLink => {
      if (typeof entry !== "object" || entry === null) return false;
      const record = entry as Record<string, unknown>;
      return typeof record["label"] === "string" && typeof record["href"] === "string";
    })
    .map((entry) => ({ label: entry.label, href: entry.href }));
}

export const settingsQuery = queryOptions({
  queryKey: ["site-settings"],
  queryFn: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    if (!data) return fallbackSettings;
    return { ...(data as unknown as SiteSettings), nav_links: normalizeNavLinks(data.nav_links) };
  },
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Product[];
  },
});

export const backgroundsQuery = queryOptions({
  queryKey: ["background-media"],
  queryFn: async (): Promise<BackgroundMedia[]> => {
    const { data, error } = await supabase
      .from("background_media")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as BackgroundMedia[];
  },
});