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

## Layout

- `app/` — App Router: `layout.tsx`, `page.tsx`, `globals.css`
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
