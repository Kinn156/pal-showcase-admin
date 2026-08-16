import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { backgroundsQuery, type BackgroundMedia } from "@/lib/site-content";

export function MediaManager() {
  const queryClient = useQueryClient();
  const { data } = useQuery(backgroundsQuery);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["background-media"] });

  const addMedia = useMutation({
    mutationFn: async (payload: { label: string; url: string; media_type: string }) => {
      const { error } = await supabase.from("background_media").insert({
        label: payload.label,
        url: payload.url,
        media_type: payload.media_type,
        is_active: true,
        sort_order: (data?.length ?? 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setLabel("");
      setUrl("");
      toast.success("Background added");
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMedia = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<BackgroundMedia> }) => {
      const { error } = await supabase.from("background_media").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void invalidate(),
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMedia = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("background_media").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Background removed");
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const path = `backgrounds/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const { error } = await supabase.storage.from("site-media").upload(path, file);
      if (error) throw error;
      await addMedia.mutateAsync({
        label: label || file.name,
        url: `/api/public/media/${path}`,
        media_type: file.type.startsWith("video") ? "video" : "image",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="surface-card rounded-xl p-6">
        <h3 className="text-sm font-medium text-foreground">Add background media</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Upload an image or looping video, or paste an existing URL.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="media-label">Label</Label>
            <Input
              id="media-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Aurora night"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="media-url">Media URL</Label>
            <Input
              id="media-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            variant="hero"
            size="sm"
            disabled={!url || addMedia.isPending}
            onClick={() =>
              addMedia.mutate({
                label: label || "Background",
                url,
                media_type: /\.(mp4|webm|mov)$/i.test(url) ? "video" : "image",
              })
            }
          >
            Add from URL
          </Button>
          <Button variant="line" size="sm" asChild disabled={uploading}>
            <label className="cursor-pointer">
              <Upload className="size-3.5" />
              {uploading ? "Uploading…" : "Upload file"}
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void upload(file);
                  event.target.value = "";
                }}
              />
            </label>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {(data ?? []).map((item) => (
          <div
            key={item.id}
            className="surface-card flex flex-wrap items-center gap-4 rounded-xl p-4"
          >
            <div className="h-16 w-24 overflow-hidden rounded-md border border-border bg-black">
              {item.media_type === "video" ? (
                <video src={item.url} muted className="size-full object-cover" />
              ) : (
                <img src={item.url} alt="" className="size-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{item.label}</p>
              <p className="truncate font-mono text-[11px] text-muted-foreground">{item.url}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={item.is_active}
                  onCheckedChange={(checked) =>
                    updateMedia.mutate({ id: item.id, patch: { is_active: checked } })
                  }
                />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${item.label}`}
                onClick={() => deleteMedia.mutate(item.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}