# Security Policy

## Reporting a vulnerability

Do not publish secrets, credentials, exploit details, or other sensitive information in a public GitHub issue.

Use GitHub's private vulnerability reporting/security advisory flow for this repository when available. If unavailable, contact the repository owner privately through GitHub before public disclosure.

## What to include

- Short description
- Affected route, component, or dependency
- Reproduction steps or minimal proof of concept
- Potential impact
- Suggested mitigation, if known

## Security principles

- Never commit API keys, Supabase service-role keys, access tokens, or passwords.
- Keep privileged database operations server-side.
- Treat submitted skill content as untrusted input.
- Validate and sanitize user-controlled content before rendering.
- Use Supabase Row Level Security for user-owned data when the database is enabled.
- Keep dependencies updated and review security advisories.
