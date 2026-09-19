# SkillShelf

SkillShelf is a production community discovery platform for real AI skills that help people build websites.

## What it does

- Discover published skills.
- Browse skills by AI tool.
- Open a dedicated page for each published skill.
- See the creator, organization, instructions, source, and creator-provided demo.
- Keep platform associations explicit: a skill only appears under the AI tool stored on its database record.

SkillShelf does **not** invent skills, demos, testimonials, metrics, source code, or creator information.

## Production stack

- Next.js 16
- React 19
- TypeScript
- Supabase PostgreSQL + Row Level Security
- Vercel
- GitHub Actions

## Real database

The production Supabase project is active and contains the SkillShelf schema:

- `profiles`
- `skills`
- `skill_versions`
- `skill_examples`

Published content is read from Supabase at runtime. There are no seeded placeholder skills in the production catalog.

Environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Never commit a Supabase service-role key or any private credential.

## Routes

- `/` — discovery
- `/skills` — published skill library
- `/skills/[slug]` — skill detail
- `/ai` — AI tool directory
- `/ai/[slug]` — skills explicitly associated with one AI tool
- `/submit` — creator requirements

## Local development

```bash
npm install
npm run dev
npm run build
```

## Documentation

- [Creator Guide](GUIDE.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## Ownership

SkillShelf is maintained by Sohail Khan through the Qofeno organization.