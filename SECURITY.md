# Security

SkillShelf treats creator accounts, submissions, source links, and review access as production data.

## Account security

- Creator authentication is handled by Supabase Auth.
- Email confirmation should remain enabled in the production Supabase Auth settings.
- Use strong, unique passwords and never share them.
- Never commit passwords, Supabase service-role keys, API keys, private tokens, or other secrets.
- The publishable Supabase key may be used in the browser; privileged keys must never be exposed there.
- Admin/reviewer access is controlled by the profiles.is_admin flag and RLS.

## Submission protection

New creator submissions are stored as pending_review and are not publicly discoverable until a reviewer approves them.

Reviewers manually verify:
- source ownership or publishing permission;
- demo/source relationship;
- claimed AI-tool association;
- instructions;
- responsive behavior on mobile, tablet, and desktop;
- exposed credentials or secrets;
- misleading or unrelated content.

## Abuse protection

Supabase Auth should use its built-in email rate limits and CAPTCHA/bot protection where enabled for the production project. Do not bypass Supabase Auth protections with custom password storage.

The application should add CAPTCHA/Turnstile to public account creation when the production CAPTCHA provider is configured. CAPTCHA verification must happen server-side or through a trusted provider integration; a client-only checkbox is not a security control.

## Review access

The /review route is for authenticated admins only. Never expose a service-role key to the browser.

## Reporting

For security issues, do not post secrets or exploit details publicly. Report privately to the project maintainer.
