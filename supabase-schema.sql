-- SENPAI ESPORTS CMS
-- Run this once in your Supabase project's SQL Editor.
create table if not exists public.site_content (
  id bigint primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create or replace function public.touch_site_content_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch before update on public.site_content
for each row execute function public.touch_site_content_updated_at();

-- Public website can read the single content row.
drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content for select using (id = 1);

-- Only signed-in Supabase users can edit. Keep your Supabase Auth account private.
drop policy if exists "Authenticated admins can write site content" on public.site_content;
create policy "Authenticated admins can write site content"
on public.site_content for all to authenticated
using (id = 1) with check (id = 1);
