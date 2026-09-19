# Contributing to SkillShelf

Thanks for contributing to SkillShelf.

## Principles

SkillShelf is a real community catalog. Contributions should improve product quality without manufacturing catalog data.

Please:

- keep user-facing content truthful and verifiable;
- do not add fake skills, fake demos, fake testimonials, fake metrics, or placeholder creator identities;
- keep AI-tool associations explicit;
- preserve creator attribution and source links;
- never commit secrets.

## Development

1. Read `README.md` and `GUIDE.md`.
2. Install dependencies with `npm install`.
3. Run `npm run build`.
4. Test the routes affected by your change.
5. Check responsive navigation and links.
6. For database changes, update the Supabase schema/migration documentation and verify RLS.

## Adding a real skill

Only add a skill when you created it or have permission from its creator.

A published record should have:

- name and description;
- actual AI-tool association;
- category;
- creator and organization;
- source URL;
- creator-provided demo URL when available;
- real usage instructions.

Do not copy a skill onto multiple AI-tool pages unless the database explicitly records those associations.

## Pull requests

Explain:

- what changed;
- why it changed;
- how it was tested;
- any database or security implications.

Keep pull requests focused and reviewable.

## Security

For sensitive vulnerabilities, follow [SECURITY.md](SECURITY.md) rather than publishing credentials or exploit details in a public issue.