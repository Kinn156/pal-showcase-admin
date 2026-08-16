import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteLink } from "./SiteLink";
import { productsQuery, type Product } from "@/lib/site-content";

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="glow-ring group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-zinc-900/50 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1">
      <div className="relative z-10 overflow-hidden rounded-t-2xl border-b border-border bg-black/60 p-4 sm:p-6">
        <div className="overflow-hidden rounded-xl border border-border shadow-[var(--shadow-float)]">
          {product.video_url ? (
            <video
              src={product.video_url}
              autoPlay
              muted
              loop
              playsInline
              className="aspect-[4/3] w-full object-cover"
            />
          ) : product.image_url ? (
            <img
              src={product.image_url}
              alt={`${product.title} interface preview`}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid aspect-[4/3] w-full place-items-center bg-white/[0.03] font-mono text-xs text-muted-foreground">
              no preview
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{product.title}</h3>
        {product.tagline ? (
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-brand">
            {product.tagline}
          </p>
        ) : null}
        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-6">
          <Button variant="line" size="sm" asChild>
            <SiteLink href={product.explore_url || "#"}>
              Explore
              <ArrowUpRight className="size-3.5" />
            </SiteLink>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProductsSection() {
  const { data, isLoading } = useQuery(productsQuery);
  const products = (data ?? []).filter((product) => product.published);

  return (
    <section id="products" className="relative border-t border-border bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Products
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            The stack, unbundled
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Every Pal Inc product runs standalone or together. Take one, take all four — nothing
            locks you in.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-[520px] rounded-2xl bg-white/5" />
              ))
            : products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

        {!isLoading && products.length === 0 ? (
          <p className="mt-12 font-mono text-sm text-muted-foreground">
            No products published yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}