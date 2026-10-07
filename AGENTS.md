<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent guide

## Working rules

- **Ask the user before committing.** Never run `git commit` without explicit approval; present a change summary and a proposed commit message first.
- Run `bun run lint` before committing.

## Runtime and tooling

- **Bun 1.x** is the package manager and the TS runtime (`bun scripts/foo.ts` runs TypeScript directly; no `tsx`/`ts-node`).
- **Biome** owns lint + format (`biome.json`). Do not add ESLint or Prettier config. `app/globals.css` is excluded from Biome.
- **Next.js 16 (App Router) + React 19.** `middleware.ts` was renamed to `proxy.ts`. Before writing Next-specific code, read `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` (the block at the top of this file is managed by `next dev`; do not edit inside it).

## Commands

| Command | Purpose |
|---|---|
| `bun run dev` | Dev server at `http://localhost:3000` |
| `bun run build` | Production build |
| `bun run lint` | `biome check .` + `bun run check:content` |
| `bun run typecheck` | `tsc --noEmit` |
| `bun test` | Unit tests under `tests/` |
| `bun run check` | `biome check --write .` (auto-fix lint/format) |
| `bun run format` | `biome format --write .` |
| `bun run check:content` | Validate every `_site.json` / `_theme.json` / `_module.json` / lesson frontmatter with zod; exits non-zero on failure |
| `bun run check:freshness` | Extract stale-article candidates (zero tokens). Not part of `lint`. Options: see header of `scripts/freshness-scan.ts` |
| `bun run check:links` | Check external link liveness from the `check:freshness` JSON; never exits non-zero on dead links |

CI (`.github/workflows/`) runs lint / content / typecheck / test / build on every PR.

## Environment

`.env.local` must define `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (template: `.env.local.example`). `resolveSupabaseEnv()` in `lib/supabase/env.ts` throws on startup if either is missing — intentional, so the auth gate can never silently pass. The Supabase project is shared with `singularity-lab-portal`.

## Architecture invariants

### Content is the source of truth

**Adding content = adding a Markdown file under `content/`; no code change.**

- Hierarchy: `Site → Theme → Module → Lesson`, laid out as `content/themes/<NN-theme>/<NN-module>/lessons/`. `NN-` prefixes set the order and are stripped from URL slugs (`toUrlSlug` in `lib/content/slug.ts`).
- Two lesson layouts, both handled by `loadLessonsForModule` in `lib/content/loader.ts`:
  - file lecture: `lessons/NN-slug.md`
  - directory lecture: `lessons/NN-slug/index.md` plus sibling `NN-*.md` files as details (sub-pages). A missing `index.md` is a validation error.
- Lecture vs. detail is decided by **file placement**. Frontmatter `type` is metadata that must match the placement; the loader ignores it.
- Meta files start with `_` (`_site.json`, `_theme.json`, `_module.json`) and are skipped by directory traversal.
- All frontmatter and meta JSON are validated by zod schemas in `lib/content/schema.ts`, used by both the loader (build time) and `scripts/check-content.ts`.
- Status gate: lesson/module/theme `status: "draft"` is hidden only when `NODE_ENV === "production"` (visible in `bun run dev`). `deprecated` stays visible; the UI should mark it.
- Never hard-code lesson/module/theme lists; derive them from `content/`.

### Rendering pipeline

`renderMarkdown` in `lib/content/mdx.ts` is the single Markdown → HTML entry point.

Chain: `remark-parse → remark-gfm → remark-directive → remarkDetailDirective → remark-github-blockquote-alert → (H2/H3 TOC collector) → remark-rehype (allowDangerousHtml) → rehype-raw → rehype-slug → rehypeExternalLinks → rehype-pretty-code (Shiki, github-light) → rehype-stringify`. Raw HTML and GitHub-style `> [!NOTE]` alerts are enabled.

- TOC ids come from `GithubSlugger` and must mirror `rehype-slug` de-duplication exactly (a repeated heading text gets `-1`, `-2` suffixes in both TOC and heading). Keep them in sync when touching the pipeline.
- `::detail{slug="..."}` is a custom remark directive rendering a card link to a detail sub-page; the page must pass a `Map<slug, DetailRef>` via the render context. An unknown slug renders a red error block on purpose, so content bugs surface while authoring.
- External `http(s)://` links automatically get `target="_blank"` + `rel="noopener noreferrer"`; relative links stay in the same tab.

### Loader cache and adjacency

- `loadContentTree()` in `lib/content/loader.ts` is wrapped in `React.cache`: the `content/` tree is walked once per render. Helpers in `lib/themes.ts` are pure in-memory filters over it.
- `getAdjacentLessonsInModule` is scoped: top-level lectures navigate among lectures (skipping details); a detail navigates only among sibling details. Navigation never crosses module or theme boundaries (themes are independent by design).

### Routing and auth

- Public: `/`, `/about`, and the auth pages in the `app/(auth)/` route group (`/login`, `/pending`, `/rejected`, `/callback`); a new unauthenticated page is added deliberately, not by default. Lesson catch-all: `app/(protected)/themes/[themeSlug]/[...slug]/page.tsx`.
- **`/themes/**` is protected by two layers; both are required:**
  1. `proxy.ts`: optimistic `supabase.auth.getUser()` check; redirects unauthenticated users to `/login?returnTo=<path>`. Matcher: `/themes/:path*`.
  2. `app/(protected)/layout.tsx`: strict server-side check via `getServerAuth()`; no user → `/login`; only `status === "active"` passes; `"rejected"` → `/rejected`; any other status → `/pending`.
- `getServerAuth()` (`lib/auth/server-auth.ts`) is `React.cache`d; call it freely. It reads the `users` table (`auth_id`, `status`, `is_deleted`); unknown `status` strings are coerced to `null` (≈ pending).
- OAuth return URL round-trips through the `sk_auth_return_to` cookie (`lib/auth/constants.ts`), not a `redirectTo` query param, because Supabase's Redirect URL allow-list does not reliably accept query strings. The login button sets it; `app/(auth)/callback/route.ts` reads and deletes it, accepting only values starting with `/` (open-redirect guard).
- Supabase clients are split by context and all go through `resolveSupabaseEnv()`: `lib/supabase/client.ts` (browser), `server.ts` (Server Components / Route Handlers / Actions; cookie writes from RSC fail silently), `lib/supabase/proxy.ts` (cookie plumbing for the root `proxy.ts`).

## Conventions

- No ESLint/Prettier config (Biome only).
- `@/*` path alias points at the repository root.
- Code comments are in English and explain *why* (invariants, external constraints, pitfalls), not *what*. UI strings stay Japanese.
- When changing architecture, update the relevant file under `docs/`. This file holds the invariants agents must always know; `docs/` holds authoring procedures and design rationale. Prefer a one-line pointer over restating a fact; where both files must carry it, this file is authoritative.

## Further reading (`docs/`)

- `docs/01-architecture.md` — design rationale, dynamic rendering, Supabase Redirect URLs
- `docs/02-content-structure.md` — content authoring rules, templates, naming
- `docs/03-testing.md` — test strategy and fixture policy
- `docs/04-content-freshness.md` — article staleness review design
