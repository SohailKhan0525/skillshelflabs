-- SkillShelf production schema
-- This file documents the production data model and RLS policy shape.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_admin boolean not null default false
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  category text not null,
  ai_tool text not null,
  creator_id uuid references public.profiles(id) on delete restrict,
  creator_name text,
  organization_name text,
  source_url text,
  demo_url text,
  instructions text,
  status text not null default 'draft' check (status in ('draft','pending_review','published','rejected','archived')),
  review_note text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_versions (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  version text not null,
  source_content text not null,
  changelog text,
  created_at timestamptz not null default now(),
  unique(skill_id, version)
);

create table if not exists public.skill_examples (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  title text not null,
  description text,
  demo_url text,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.skill_versions enable row level security;
alter table public.skill_examples enable row level security;

-- Public discovery only exposes approved/published skills.
drop policy if exists "skills_select_published" on public.skills;
create policy "skills_select_published" on public.skills
for select using (
  status = 'published'
  or auth.uid() = creator_id
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
);

drop policy if exists "skills_insert_own" on public.skills;
create policy "skills_insert_own" on public.skills
for insert to authenticated
with check (auth.uid() = creator_id);

drop policy if exists "skills_update_own" on public.skills;
create policy "skills_update_own" on public.skills
for update to authenticated
using (
  auth.uid() = creator_id
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
)
with check (
  auth.uid() = creator_id
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
);

drop policy if exists "skills_delete_own" on public.skills;
create policy "skills_delete_own" on public.skills
for delete to authenticated
using (
  auth.uid() = creator_id
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
);

drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public" on public.profiles
for select using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert to authenticated with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "skill_versions_select_published_or_owner" on public.skill_versions;
create policy "skill_versions_select_published_or_owner" on public.skill_versions
for select using (
  exists (select 1 from public.skills s where s.id = skill_versions.skill_id and (
    s.status = 'published'
    or s.creator_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  ))
);

drop policy if exists "skill_versions_insert_owner" on public.skill_versions;
create policy "skill_versions_insert_owner" on public.skill_versions
for insert to authenticated
with check (
  exists (select 1 from public.skills s where s.id = skill_versions.skill_id and s.creator_id = auth.uid())
);

drop policy if exists "skill_examples_select_published_or_owner" on public.skill_examples;
create policy "skill_examples_select_published_or_owner" on public.skill_examples
for select using (
  exists (select 1 from public.skills s where s.id = skill_examples.skill_id and (
    s.status = 'published'
    or s.creator_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  ))
);

drop policy if exists "skill_examples_insert_owner" on public.skill_examples;
create policy "skill_examples_insert_owner" on public.skill_examples
for insert to authenticated
with check (
  exists (select 1 from public.skills s where s.id = skill_examples.skill_id and s.creator_id = auth.uid())
);

-- New auth users get a profile automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, username, avatar_url, bio)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Creator'),
    null,
    null,
    null
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
