# SkillShelf + Supabase

The repository contains the initial production data model in `supabase/schema.sql`.

## Important

This file is intentionally not applied to an existing Supabase project automatically. SkillShelf should use a dedicated Supabase project rather than an unrelated personal project.

## Production setup

1. Create a dedicated Supabase project for SkillShelf.
2. Apply `supabase/schema.sql` as a migration.
3. Enable authentication providers you want to support.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel.
5. Keep the Supabase service-role key server-side and never expose it to the browser.
6. Verify Row Level Security before publishing creator write flows.
