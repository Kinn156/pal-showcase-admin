import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { fallbackSettings, settingsQuery, type SiteSettings } from "@/lib/site-content";

export function SettingsManager() {
  const queryClient = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [form, setForm] = useState<SiteSettings>(data ?? fallbackSettings);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const update = (patch: Partial<SiteSettings>) => setForm((current) => ({ ...current, ...patch }));

  const save = useMutation({
    mutationFn: async (payload: SiteSettings) => {
      const { id: _id, ...rest } = payload;
      const { error } = await supabase.from("site_settings").update(rest).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Site metadata saved");
      void queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div className="surface-card space-y-4 rounded-xl p-6">
        <h3 className="text-sm font-medium text-foreground">Hero & messaging</h3>
        <div className="space-y-2">
          <Label>Motto</Label>
          <Input value={form.motto} onChange={(event) => update({ motto: event.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Hero subtitle</Label>
          <Textarea
            rows={3}
            value={form.hero_subtitle}
            onChange={(event) => update({ hero_subtitle: event.target.value })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary CTA label</Label>
            <Input
              value={form.primary_cta_label}
              onChange={(event) => update({ primary_cta_label: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Primary CTA URL</Label>
            <Input
              value={form.primary_cta_url}
              onChange={(event) => update({ primary_cta_url: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary CTA label</Label>
            <Input
              value={form.secondary_cta_label}
              onChange={(event) => update({ secondary_cta_label: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary CTA URL</Label>
            <Input
              value={form.secondary_cta_url}
              onChange={(event) => update({ secondary_cta_url: event.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="surface-card space-y-4 rounded-xl p-6">
        <h3 className="text-sm font-medium text-foreground">Announcement bar</h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={form.announcement_visible}
            onCheckedChange={(checked) => update({ announcement_visible: checked })}
          />
          <span className="text-xs text-muted-foreground">Visible</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Text</Label>
            <Input
              value={form.announcement_text}
              onChange={(event) => update({ announcement_text: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={form.announcement_url}
              onChange={(event) => update({ announcement_url: event.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="surface-card space-y-4 rounded-xl p-6">
        <h3 className="text-sm font-medium text-foreground">Navigation links</h3>
        {form.nav_links.map((link, index) => (
          <div key={index} className="flex flex-wrap items-end gap-3">
            <div className="min-w-40 flex-1 space-y-2">
              <Label>Label</Label>
              <Input
                value={link.label}
                onChange={(event) =>
                  update({
                    nav_links: form.nav_links.map((entry, entryIndex) =>
                      entryIndex === index ? { ...entry, label: event.target.value } : entry,
                    ),
                  })
                }
              />
            </div>
            <div className="min-w-40 flex-1 space-y-2">
              <Label>Href</Label>
              <Input
                value={link.href}
                onChange={(event) =>
                  update({
                    nav_links: form.nav_links.map((entry, entryIndex) =>
                      entryIndex === index ? { ...entry, href: event.target.value } : entry,
                    ),
                  })
                }
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Remove ${link.label}`}
              onClick={() =>
                update({ nav_links: form.nav_links.filter((_entry, i) => i !== index) })
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="line"
          size="sm"
          onClick={() => update({ nav_links: [...form.nav_links, { label: "", href: "/" }] })}
        >
          <Plus className="size-3.5" />
          Add link
        </Button>
      </div>

      <div className="surface-card space-y-4 rounded-xl p-6">
        <h3 className="text-sm font-medium text-foreground">About section</h3>
        <div className="space-y-2">
          <Label>Heading</Label>
          <Input
            value={form.about_heading}
            onChange={(event) => update({ about_heading: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Body</Label>
          <Textarea
            rows={7}
            value={form.about_body}
            onChange={(event) => update({ about_body: event.target.value })}
          />
        </div>
      </div>

      <Button variant="hero" disabled={save.isPending} onClick={() => save.mutate(form)}>
        Save site metadata
      </Button>
    </div>
  );
}
