---
description: How to work with this repo
alwaysApply: true
---

# Classical Guitar Practice — Repo context

## Stack

- **Runtime**: Next.js 15 (App Router), React 19
- **Language**: TypeScript
- **Deploy**: Vercel (framework auto-detected; optional `vercel.json` at root)
- **Lint**: ESLint with `next/core-web-vitals` (`.eslintrc.json`)

## Data

- **S3-compatible object storage** (OVHCloud) stores app data. Required env vars: `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_ENDPOINT`, `S3_BUCKET`, `S3_REGION`.
- All reads/writes go through `lib/blob.ts` (`readJson`, `writeJson`, `deleteBlob`) using `@aws-sdk/client-s3` with `forcePathStyle: true`.
- Always call `noStore()` (from `next/cache`) at the top of any layout or server component that reads from storage — `dynamic = "force-dynamic"` alone is not sufficient to bypass Next.js data cache in layouts.

## Password protection

- When **`SITE_PASSWORD`** (env var) is set, all routes except `/auth` require `?password=<password>`.
- Unauthenticated visits redirect to `/auth?next=<path>`.
- Use **`@/components/Link`** for in-app links so the password query param is preserved when navigating.

## Layout

- `app/` — App Router: `layout.tsx`, `page.tsx`, `globals.css`
- `components/` — Shared UI (e.g. `Link` that preserves `?password=`)
- `next.config.ts` — Next.js config
- `tsconfig.json` — Path alias `@/*` → repo root
- No README by default; avoid creating one unless asked.

## Conventions

- Prefer React data bindings and safe URLs (see workspace Frontend Security rules).
- Use inline `uv` requirements for any Python scripts.
- No interactive git commands.
- One canonical project doc: **CLAUDE.md** (this file). AGENTS.md and the Cursor rule in `.cursor/rules/` symlink here — edit only this file for repo context.

## Commands

| Command         | Purpose              |
|----------------|----------------------|
| `npm run dev`  | Local dev server     |
| `npm run build`| Production build     |
| `npm run start`| Run production build |
| `npm run lint` | Run ESLint           |
