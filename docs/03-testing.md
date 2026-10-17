# Test strategy

The main concern is **content integrity**, following the core rule that adding content = adding Markdown files. Which tests exist is visible in `tests/`; CI composition is in `.github/workflows/`; Biome rules (including `noConsole`, with a `scripts/**` override) are in `biome.json`. The runner is `bun test` (Jest-compatible API, no extra dependency).

DB type-generation checks are out of scope: there is no generated types file and the only DB access is reading the `users` table. Revisit if DB usage grows.

## Test pyramid and priority

```text
        E2E (auth flow / manual, future)          few
   Content integrity + build (integration gate)   core
 Pure-logic unit (slug / adjacency / schema / mdx) many
```

- The integration layer here is `check:content` (frontmatter / meta JSON validation) and `build`. Because features grow by adding content, "content is not broken" is the main regression defense.
- Priority is decided by change frequency, blast radius and failure cost: content integrity > routing foundation (slug / adjacency) > MDX rendering > auth status resolution.
- Before releases, or when a change touches auth/routing, manually verify the main flows (login -> browse -> logout; unauthenticated `/themes/**` -> `/login?returnTo=...`; pending/rejected users redirected to `/pending` / `/rejected`). No automated E2E yet.

## When a unit test is needed

Write tests for auth/authorization logic, shared utilities called from many places, and error handling. Skip what lint, typecheck, `check:content`, build and review already cover: UI appearance, data hand-off in `page.tsx`, Supabase client wrappers, constants and types, and `loader.ts` file traversal.

Why the current targets matter: slug conversion underpins all routing; adjacency has intricate scope rules; frontmatter validation must reliably reject bad content; MDX rendering has delicate invariants (TOC id de-duplication in sync with rehype-slug, `::detail`, external link attributes); the content-index projection must keep its invariants (lectures only, no details, no `Lesson.body`); auth status resolution is top priority (unknown status -> `null`, treated as pending).

## Fixtures

- Unit tests use mocks/stubs or in-memory fixed data and never touch Supabase or the real filesystem.
- Content-dependent logic (`resolveAdjacentLessons`, `collect*` in `lib/themes.ts`) is exported as a pure core separate from file traversal and tested against trees built with the in-memory factories in `tests/helpers/fixtures.ts`.

## Conventions

- Tests live under `tests/`, mirroring the structure of the code under test; files are named `*.test.ts`.
- Test names describe the subject and expected behavior.
- Assert return values, resulting state and error behavior. Do not assert internal call sequences or the arguments a mock was called with.
