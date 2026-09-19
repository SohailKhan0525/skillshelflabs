# SkillShelf Guide

This guide covers how real creators and contributors should use SkillShelf.

## Creator checklist

Before publishing a skill, verify:

1. The skill is yours or you have permission to publish it.
2. The name and description describe the real skill.
3. The selected AI tool is genuinely supported.
4. The creator and organization are accurate.
5. The source URL points to the real source.
6. The demo URL points to a real creator-controlled demo, when available.
7. Instructions explain the actual workflow.
8. Prerequisites and limitations are documented.
9. No fabricated examples, testimonials, usage numbers, or performance claims are included.

## AI-tool association

AI-tool pages are database-driven.

A skill is shown at `/ai/chatgpt` only when its published `ai_tool` value is `ChatGPT`. The same rule applies to Claude, Codex, Gemini, and Cursor.

This prevents one listing from appearing on every platform page by accident.

## Database-backed publishing

The production catalog is stored in Supabase. The public application reads published records at runtime.

The current schema includes:

- `profiles` for creator identities;
- `skills` for the catalog;
- `skill_versions` for source/version history;
- `skill_examples` for creator-provided examples.

Creator authentication and a persistent self-service submission UI are still separate work from the public discovery pages. Until that workflow is enabled, `/submit` describes the required data without pretending to save a submission.

## Local verification

Run:

```bash
npm install
npm run build
```

Then inspect:

```text
/
 /skills
 /ai
 /ai/chatgpt
 /skills/<published-slug>
 /submit
```

Check navigation on desktop and mobile and verify external source/demo links before publishing changes.