
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text,
  video_url text,
  explore_url text NOT NULL DEFAULT '#',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.background_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT 'Background',
  media_type text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.background_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.background_media TO authenticated;
GRANT ALL ON public.background_media TO service_role;
ALTER TABLE public.background_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view background media" ON public.background_media FOR SELECT USING (true);
CREATE POLICY "Admins can manage background media" ON public.background_media FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  motto text NOT NULL DEFAULT 'Freedom of Software',
  hero_subtitle text NOT NULL DEFAULT '',
  announcement_text text NOT NULL DEFAULT '',
  announcement_visible boolean NOT NULL DEFAULT false,
  announcement_url text NOT NULL DEFAULT '',
  primary_cta_label text NOT NULL DEFAULT 'Join',
  primary_cta_url text NOT NULL DEFAULT '#',
  secondary_cta_label text NOT NULL DEFAULT 'Talk to team',
  secondary_cta_url text NOT NULL DEFAULT '#',
  nav_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  about_heading text NOT NULL DEFAULT '',
  about_body text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins can read site media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload site media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (id, motto, hero_subtitle, announcement_text, announcement_visible, announcement_url, nav_links, about_heading, about_body)
VALUES (
  1,
  'Freedom of Software',
  'Pal Inc builds the open infrastructure layer that lets teams ship software without permission, lock-in, or limits.',
  'Pal Inc Platform 2.0 is now generally available',
  true,
  '#products',
  '[{"label":"Company & Investors","href":"/company"},{"label":"Products","href":"/#products"},{"label":"Terms & Policy","href":"/terms"},{"label":"Support","href":"/support"}]'::jsonb,
  'Infrastructure without gatekeepers',
  'Pal Inc exists for a single reason: software should be free to move. We build the runtime, data and delivery primitives that let engineering teams deploy anywhere, own their data, and replace any part of the stack without rewriting the rest. Our philosophy is open by default, private by design, and fast as a requirement — not a feature. From edge compute to observability, every layer of the Pal Inc platform is documented, portable and inspectable.'
);

INSERT INTO public.products (title, tagline, description, image_url, explore_url, sort_order) VALUES
('Pal Cloud', 'Deploy anywhere in seconds', 'A global edge runtime with instant rollbacks, preview environments and zero-config scaling for every framework.', null, 'https://example.com/pal-cloud', 1),
('Pal Data', 'Postgres without the ops', 'Serverless Postgres with branching, point-in-time recovery and row-level security wired in from the first query.', null, 'https://example.com/pal-data', 2),
('Pal Observe', 'See every request', 'Traces, logs and metrics unified in one timeline, with anomaly detection that actually understands your deploys.', null, 'https://example.com/pal-observe', 3),
('Pal Shield', 'Security at the edge', 'Managed WAF, bot mitigation and secrets management that run in the same network hop as your application.', null, 'https://example.com/pal-shield', 4);

INSERT INTO public.background_media (label, media_type, url, is_active, sort_order) VALUES
('Aurora grid', 'image', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2400&q=80', true, 1),
('Datacenter dark', 'image', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=80', true, 2);
