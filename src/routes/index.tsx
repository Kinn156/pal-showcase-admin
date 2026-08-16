import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { HeroSection } from "@/components/site/HeroSection";
import { ProductsSection } from "@/components/site/ProductsSection";
import { AboutSection } from "@/components/site/AboutSection";
import { SiteFooter } from "@/components/site/SiteFooter";

const title = "Pal Inc — Freedom of Software";
const description =
  "Pal Inc builds the open infrastructure layer — edge cloud, serverless Postgres, observability and security — for teams that refuse vendor lock-in.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-black">
      <SiteHeader />
      <main>
        <HeroSection />
        <ProductsSection />
        <AboutSection />
      </main>
      <SiteFooter />
    </div>
  );
}
