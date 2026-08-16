import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/site/Logo";
import { SiteLink } from "@/components/site/SiteLink";
import { MediaManager } from "@/components/admin/MediaManager";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { useAuth } from "@/hooks/useAuth";

const title = "Admin console | Pal Inc";
const description = "Manage Pal Inc products, hero background media and site metadata.";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { session, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-black">
        <p className="font-mono text-xs text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-black px-5">
        <div className="surface-card max-w-sm rounded-2xl p-8 text-center">
          <h1 className="text-lg font-semibold text-foreground">Admin access required</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This account does not have the admin role. Ask an existing admin to grant access.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button variant="line" size="sm" onClick={() => void signOut()}>
              Sign out
            </Button>
            <Button variant="hero" size="sm" asChild>
              <SiteLink href="/">Back to site</SiteLink>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-border bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="line" size="sm" asChild>
              <SiteLink href="/">View site</SiteLink>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Content console</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything on the public site is driven by the data below.
        </p>

        <Tabs defaultValue="products" className="mt-10">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="media">Background media</TabsTrigger>
            <TabsTrigger value="settings">Site metadata</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-8">
            <ProductsManager />
          </TabsContent>
          <TabsContent value="media" className="mt-8">
            <MediaManager />
          </TabsContent>
          <TabsContent value="settings" className="mt-8">
            <SettingsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
