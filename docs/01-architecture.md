# Architecture: design rationale

Commands, conventions and architectural invariants live in `AGENTS.md`; schemas live in `lib/content/schema.ts`. This file only records design decisions and operational notes that cannot be read from the code.

## Why filesystem-driven content

The predecessor (`web-skill-lessons`) hard-coded a lesson array in `lib/lessons.ts`, so every new lesson required keeping a type, an array and a file name in sync in three places. Moving to filesystem layout plus frontmatter lets authors add content without touching code, which is the core rule: **adding content = adding a Markdown file under `content/`**.

The site is an explanatory reference, not a hands-on course. There is no enforced learning order between themes and no recommended audience.

## Why `/themes/**` is dynamically rendered

The protected layout reads cookies, so `/themes/**` cannot be statically generated. The original plan of statically generating every page was dropped when authentication was introduced.

## Supabase Redirect URLs

This service shares its Supabase project with the portal (`singularity-lab-portal`). If an OAuth `redirectTo` is not in the Redirect URLs allow-list, Supabase Auth discards it and falls back to the Site URL (the portal). When adding a new domain, add `https://<domain>/callback` to the Redirect URLs.
