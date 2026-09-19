# Security Policy

## Reporting

Do not publish credentials, tokens, private user data, or sensitive exploit details in a public issue.

Use GitHub's private vulnerability reporting/security advisory flow when available. Otherwise contact the repository owner privately through GitHub.

## Production security rules

- Never commit Supabase service-role keys.
- Keep privileged database operations server-side.
- Use the publishable Supabase key only where appropriate.
- Keep Row Level Security enabled.
- Treat creator-submitted content and URLs as untrusted input.
- Validate URLs and user-controlled content before adding new write flows.
- Review dependency and framework security updates.

## Report details

Include the affected route/component, reproduction steps, impact, and suggested mitigation when safe to share.