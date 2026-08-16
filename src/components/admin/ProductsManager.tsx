import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { productsQuery, type Product } from "@/lib/site-content";

type Draft = Omit<Product, "id">;

const emptyDraft: Draft = {
  title: "",
  tagline: "",
  description: "",
  image_url: null,
  video_url: null,
  explore_url: "#",
  sort_order: 99,
  published: true,
};

function ProductForm({
  value,
  onChange,
  onUpload,
  uploading,
}: {
  value: Draft;
  onChange: (patch: Partial<Draft>) => void;
  onUpload: (file: File) => void;
  uploading: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={value.title} onChange={(event) => onChange({ title: event.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Tagline</Label>
        <Input
          value={value.tagline}
          onChange={(event) => onChange({ tagline: event.target.value })}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label>Description</Label>
        <Textarea
          rows={3}
          value={value.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input
          value={value.image_url ?? ""}
          onChange={(event) => onChange({ image_url: event.target.value || null })}
        />
      </div>
      <div className="space-y-2">
        <Label>Video URL (optional)</Label>
        <Input
          value={value.video_url ?? ""}
          onChange={(event) => onChange({ video_url: event.target.value || null })}
        />
      </div>
      <div className="space-y-2">
        <Label>Explore URL</Label>
        <Input
          value={value.explore_url}
          onChange={(event) => onChange({ explore_url: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Sort order</Label>
        <Input
          type="number"
          value={value.sort_order}
          onChange={(event) => onChange({ sort_order: Number(event.target.value) })}
        />
      </div>
      <div className="flex items-center gap-6 sm:col-span-2">
        <div className="flex items-center gap-2">
          <Switch
            checked={value.published}
            onCheckedChange={(checked) => onChange({ published: checked })}
          />
          <span className="text-xs text-muted-foreground">Published</span>
        </div>
        <Button variant="line" size="sm" asChild disabled={uploading}>
          <label className="cursor-pointer">
            <Upload className="size-3.5" />
            {uploading ? "Uploading…" : "Upload mockup"}
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onUpload(file);
                event.target.value = "";
              }}
            />
          </label>
        </Button>
      </div>
    </div>
  );
}

export function ProductsManager() {
  const queryClient = useQueryClient();
  const { data } = useQuery(productsQuery);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Record<string, Draft>>({});
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["products"] });

  const uploadFile = async (file: File, apply: (url: string, isVideo: boolean) => void, key: string) => {
    setUploadingFor(key);
    try {
      const path = `products/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const { error } = await supabase.storage.from("site-media").upload(path, file);
      if (error) throw error;
      apply(`/api/public/media/${path}`, file.type.startsWith("video"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploadingFor(null);
    }
  };

  const create = useMutation({
    mutationFn: async (payload: Draft) => {
      const { error } = await supabase.from("products").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      setDraft(emptyDraft);
      setCreating(false);
      toast.success("Product created");
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const save = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Draft }) => {
      const { error } = await supabase.from("products").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_result, variables) => {
      setEditing((current) => {
        const next = { ...current };
        delete next[variables.id];
        return next;
      });
      toast.success("Product saved");
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product deleted");
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{(data ?? []).length} products</p>
        <Button variant="hero" size="sm" onClick={() => setCreating((value) => !value)}>
          <Plus className="size-3.5" />
          New product
        </Button>
      </div>

      {creating ? (
        <div className="surface-card rounded-xl p-6">
          <h3 className="mb-5 text-sm font-medium text-foreground">New product</h3>
          <ProductForm
            value={draft}
            uploading={uploadingFor === "new"}
            onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
            onUpload={(file) =>
              void uploadFile(
                file,
                (url, isVideo) =>
                  setDraft((current) => ({
                    ...current,
                    ...(isVideo ? { video_url: url } : { image_url: url }),
                  })),
                "new",
              )
            }
          />
          <div className="mt-5 flex gap-2">
            <Button
              variant="hero"
              size="sm"
              disabled={!draft.title || create.isPending}
              onClick={() => create.mutate(draft)}
            >
              Create
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {(data ?? []).map((product) => {
          const isOpen = Boolean(editing[product.id]);
          const value = editing[product.id] ?? product;
          return (
            <div key={product.id} className="surface-card rounded-xl p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-14 w-20 overflow-hidden rounded-md border border-border bg-black">
                  {product.image_url ? (
                    <img src={product.image_url} alt="" className="size-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{product.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{product.tagline}</p>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {product.published ? "live" : "draft"}
                </span>
                <Button
                  variant="line"
                  size="sm"
                  onClick={() =>
                    setEditing((current) => {
                      const next = { ...current };
                      if (isOpen) delete next[product.id];
                      else next[product.id] = { ...product };
                      return next;
                    })
                  }
                >
                  {isOpen ? "Close" : "Edit"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${product.title}`}
                  onClick={() => remove.mutate(product.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              {isOpen ? (
                <div className="mt-6 border-t border-border pt-6">
                  <ProductForm
                    value={value}
                    uploading={uploadingFor === product.id}
                    onChange={(patch) =>
                      setEditing((current) => ({
                        ...current,
                        [product.id]: { ...(current[product.id] ?? product), ...patch },
                      }))
                    }
                    onUpload={(file) =>
                      void uploadFile(
                        file,
                        (url, isVideo) =>
                          setEditing((current) => ({
                            ...current,
                            [product.id]: {
                              ...(current[product.id] ?? product),
                              ...(isVideo ? { video_url: url } : { image_url: url }),
                            },
                          })),
                        product.id,
                      )
                    }
                  />
                  <div className="mt-5">
                    <Button
                      variant="hero"
                      size="sm"
                      disabled={save.isPending}
                      onClick={() =>
                        save.mutate({
                          id: product.id,
                          patch: {
                            title: value.title,
                            tagline: value.tagline,
                            description: value.description,
                            image_url: value.image_url,
                            video_url: value.video_url,
                            explore_url: value.explore_url,
                            sort_order: value.sort_order,
                            published: value.published,
                          },
                        })
                      }
                    >
                      Save changes
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
