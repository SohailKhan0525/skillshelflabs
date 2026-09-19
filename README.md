# SkillShelf

SkillShelf is a community discovery platform for AI skills that help people build websites.

The goal is simple: make AI skills understandable before someone installs or uses them. Each skill can have a dedicated page with its purpose, creator, AI tool, source, instructions, examples, and demo.

## Current featured skill

**Frontend UI & UX Wizard** — created by **Sohail Khan**.

- AI tool: ChatGPT
- Category: Website design
- Source: `skills/frontend-ui-ux-wizard/SKILL.md`
- Demo: `/skills/frontend-ui-ux-wizard/demo`

## Product routes

- `/` — discovery home
- `/skills` — all website skills
- `/skills/[slug]` — dedicated skill pages
- `/skills/[slug]/demo` — live demos
- `/ai` — browse by AI tool
- `/ai/[slug]` — tool-specific discovery
- `/submit` — creator publishing flow

## Stack

- Next.js
- React
- TypeScript
- Vercel
- Supabase — production data layer to be connected

## Local development

```bash
npm install
npm run dev
```

## Documentation

- [Creator Guide](GUIDE.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## Ownership

SkillShelf and the current featured skill are authored/maintained by **Sohail Khan**. Third-party skills should only be published with appropriate permission and attribution.
