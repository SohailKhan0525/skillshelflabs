# SkillShelf + Supabase

SkillShelf uses Supabase as its real production database.

## Current production project

The connected project is:

- Project ref: `muthhviweeivqegarezg`
- Region: `ap-south-1`
- Status: active and healthy

The Supabase dashboard/project display name is currently `web-creative-engine`. The project ref is the authoritative identifier used by the application.

## Production tables

The public schema currently contains:

- `profiles`
- `skills`
- `skill_versions`
- `skill_examples`

All four SkillShelf content tables have Row Level Security enabled.

## Application connection

The Next.js app reads Supabase through `lib/supabase.ts` using:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

These values belong in Vercel environment variables and local `.env.local`.

Never commit credentials.

## Data rules

- Only `skills.status = 'published'` is displayed publicly.
- AI-tool pages filter by the exact `ai_tool` value stored on the skill.
- Creator data must be real.
- Source and demo links must come from the creator.
- No seed/demo content should be added merely to make the UI look populated.

## Security

Do not expose the Supabase service-role key to the browser. Any future creator write workflow must use authenticated users plus appropriate RLS policies.