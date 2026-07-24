# minforge.dev — Takumi Ishii Portfolio

Bilingual (JA/EN) portfolio site for 石井拓実 / Takumi Ishii, built with Next.js
(App Router) and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

The dev server picks the first free port starting at 3000 — check the
terminal output for the actual URL if 3000 is already in use on this machine
(it currently is: pm2's `attendance` service listens there).

Visiting `/` redirects to `/ja` or `/en` based on the `locale` cookie, falling
back to the `Accept-Language` header.

## Structure

- `src/app/[locale]/` — locale-scoped layout, home page, metadata (hreflang,
  OGP, per-locale title/description).
- `src/i18n/dictionaries/{ja,en}.json` — all UI copy. Edit these to change
  wording; no other file contains user-facing text.
- `src/proxy.ts` — locale detection/redirect (Next's renamed `middleware`
  convention).
- `src/data/works.ts`, `src/data/skills.ts` — Works/Skills content (images,
  links); localized title/description text lives in the dictionaries under
  matching ids.
- `src/app/api/contact/route.ts` + `src/lib/mailer.ts` — contact form
  handling via nodemailer/SMTP, with a honeypot field and in-memory
  per-IP rate limiting (`src/lib/rate-limit.ts`).

## Environment variables

Copy `.env.example` to `.env` and fill in real values (never commit `.env`):

```
NEXT_PUBLIC_SITE_URL=https://minforge.dev
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
CONTACT_FROM_EMAIL=no-reply@minforge.dev
CONTACT_TO_EMAIL=contact@minforge.dev
```

## Still needed before launch

Per the site spec, these are intentionally placeholder and need real content:

- `public/images/hero/hero-bg.jpg` — hero background visual
- `public/images/about/profile.jpg` — profile photo
- `public/images/works/{award,expo-pr,youtube,attendance-system}.jpg` — work photos
- `public/images/og/og-default.jpg` — OGP share image
- About section copy (`src/i18n/dictionaries/*.json` → `about.paragraphs`) is a
  first draft — confirm wording before publishing
- Whether to list the tutoring-school system's tech stack (currently kept
  generic in the Works copy)
- SMTP credentials in `.env`

## Deploying (self-hosted, per spec)

1. `npm run build` — `next.config.ts` sets `output: "standalone"`, so the
   build emits a self-contained server at `.next/standalone/`.
2. Copy `.next/standalone/`, `.next/static/` (into `.next/standalone/.next/static/`),
   and `public/` (into `.next/standalone/public/`) to the server.
3. Run it with pm2 or Docker, e.g. `pm2 start .next/standalone/server.js --name portfolio`.
   Pick a free port via the `PORT` env var — 3000 is already taken on this
   host by the `attendance` pm2 process.
4. Put Nginx in front as a reverse proxy, terminating TLS via
   Let's Encrypt/certbot, proxying to the app's port.
5. Point `minforge.dev`'s DNS A/AAAA records at the server (use DDNS if the
   IP isn't static).
