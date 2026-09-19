-- SkillShelf initial data model
-- Apply this migration only to the Supabase project created for SkillShelf.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  category text not null,
  ai_tool text not null,
  creator_id uuid not null references public.profiles(id) on delete restrict,
  source_url text,
  demo_url text,
  instructions text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
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

create policy "published skills are public"
on public.skills for select
using (status = 'published');

create policy "published examples are public"
on public.skill_examples for select
using (
  exists (
    select 1 from public.skills
    where skills.id = skill_examples.skill_id
      and skills.status = 'published'
  )
);

create policy "users can read their own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "creators can manage their skills"
on public.skills for all
using (auth.uid() = creator_id)
with check (auth.uid() = creator_id);

create policy "creators can manage their skill versions"
on public.skill_versions for all
using (
  exists (
    select 1 from public.skills
    where skills.id = skill_versions.skill_id
      and skills.creator_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.skills
    where skills.id = skill_versions.skill_id
      and skills.creator_id = auth.uid()
  )
);

create policy "creators can manage their examples"
on public.skill_examples for all
using (
  exists (
    select 1 from public.skills
    where skills.id = skill_examples.skill_id
      and skills.creator_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.skills
    where skills.id = skill_examples.skill_id
      and skills.creator_id = auth.uid()
  )
);
