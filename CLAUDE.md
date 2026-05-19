# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite (port 8080) + Express form API (port 8787) concurrently
npm run build        # Production build → dist/
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
npm run form-api     # Start Express server only (port 8787)
```

Tests live in `src/**/*.{test,spec}.{ts,tsx}` and run in jsdom with `@testing-library/react`.

## Architecture

This is a **Vite + React + TypeScript marketing/onboarding website** for GoBuyMe (a Nigerian delivery platform). It has two runtime processes in dev:

- **Frontend** — Vite SPA on port 8080; React Router v6 BrowserRouter with 14 routes; `netlify.toml` handles SPA fallback (`/* → /index.html`) in production.
- **Form API** — Express server (`server/form-api.mjs`) on port 8787; Vite proxies `/api → http://127.0.0.1:8787` in dev. In production (Netlify), `/api/form-submit` is redirected to `netlify/functions/form-submit.mjs`.

### Form email pipeline

All site contact/signup forms (Contact, Affiliate, etc.) use a shared utility:

```
submitSiteForm(formId, fields)   ← src/lib/submitSiteForm.ts
  → POST /api/form-submit
    dev:  server/form-api.mjs          (Resend SDK)
    prod: netlify/functions/form-submit.mjs  (⚠ still uses nodemailer/SMTP — not yet migrated)
```

**Critical sync requirement:** `ALLOWED_FORMS` must be kept identical in both `server/form-api.mjs` and `netlify/functions/form-submit.mjs`, and the `SiteFormId` union type in `src/lib/submitSiteForm.ts` must match both. Per-form `to` overrides (e.g. `book-a-call → partners@gobuyme.shop`) exist only in the Express server — the Netlify function does not have them yet.

### Registration modal

`RegistrationModal` (`src/components/site/RegistrationModal.tsx`) is a multi-step dialog (vendor: 3 steps, rider: 2 steps) that POSTs **directly to the mobile backend** at `https://api.gobuyme.shop/api/v1/auth/register` — it does not go through the form API. Identity document fields are collected in the UI but not submitted; document upload happens inside the mobile app post-login via `PATCH /vendors/me/document` and `PATCH /riders/me/document`.

### Component layout

- `src/components/site/` — page-level section components used by pages
- `src/components/ui/` — shadcn/ui primitives; **do not edit these manually**, add new ones via the shadcn CLI
- `src/pages/` — one file per route; each imports `PageNav` and `Footer` from `site/`

## Design system

The site uses a **"Kinetic Pop Maximalist" / brutalist** aesthetic. Key conventions:

**Typography utilities** (defined in `src/index.css`):
- `.font-display` — Archivo Black, tight tracking (`-0.02em`)
- `.font-mono-pop` — JetBrains Mono; used for labels, tags, CTAs

**Custom Tailwind tokens:**
- `border-ink` — foreground-coloured border (the signature thick black outline)
- `shadow-pop` / `shadow-pop-sm` — hard 8px/4px offset box shadows (no blur)
- `bg-hot` / `text-hot-foreground` — tomato red sections
- `bg-accent` / `text-accent-foreground` — highlighter yellow
- `bg-primary` — GoBuyMe orange (`hsl(22 100% 54%)`)

**Standard CTA button pattern:**
```tsx
className="rounded-full border-2 border-ink bg-primary text-primary-foreground shadow-pop-sm
           hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
           font-mono-pop text-xs uppercase tracking-widest"
```

**Standard card pattern:**
```tsx
className="rounded-3xl border-2 border-ink bg-card p-7 shadow-pop-sm"
```

## Environment variables

| Variable | Used by | Purpose |
|---|---|---|
| `RESEND_API_KEY` | `server/form-api.mjs` | Resend API key |
| `RESEND_FROM` | `server/form-api.mjs` | Sender address (verified Resend domain) |
| `FORMS_TO_EMAIL` | both servers | Default recipient for form notifications |
| `PARTNERS_EMAIL` | `server/form-api.mjs` | Override recipient for `book-a-call` form (defaults to `partners@gobuyme.shop`) |
| `FORM_API_PORT` | `server/form-api.mjs` | Express port (default `8787`) |
| `VITE_FORM_API_URL` | `src/lib/submitSiteForm.ts` | Override form API endpoint (defaults to `/api/form-submit`) |

The Netlify function still reads SMTP env vars (`SMTP_HOST`, `SMTP_FROM_USER`, etc.) — set those in the Netlify dashboard until the function is migrated to the Resend SDK.
