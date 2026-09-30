# Content authoring rules

Authoring rules, templates and naming conventions. The actual theme/module/lesson list is whatever is under `content/themes/` (run `bun scripts/dev/print-tree.ts` to print the tree). Exact frontmatter and meta JSON fields are defined by the zod schemas in `lib/content/schema.ts`. The two lesson layouts are described in `CLAUDE.md`.

The site is an explanatory reference: no step-by-step hands-on format, and themes are fully independent (no recommended reading order or audience notes).

## 1. Lecture vs. detail

- **Lecture** (`type: lecture`): main content listed in the module TOC. File-type (`NN-slug.md`) or directory-type (`NN-slug/index.md` plus detail files).
- **Detail** (`type: detail`): deep-dive page under a directory-type lecture (`NN-slug.md`).

Choose the directory type when the lecture has details. Link to details from the lecture body with the `::detail` directive by default. If details are self-contained cheat-sheet material (e.g. a Markdown syntax list), a summary table at the end of the lecture may be used instead.

### `::detail` directive

```markdown
::detail{slug="what-is-git"}
```

- `slug` is the detail file name without the `NN-` prefix and extension (`01-what-is-git.md` -> `what-is-git`).
- Card title and description come from the detail's frontmatter, so always write `description` on details.
- An unknown slug renders a red error block. This is intentional, to surface broken links while authoring.

## 2. Adding a lesson

```bash
# A. File-type lecture (no details)
content/themes/{theme}/{module}/lessons/NN-slug.md

# B. Directory-type lecture with details
mkdir -p content/themes/{theme}/{module}/lessons/NN-slug
#   NN-slug/index.md   lecture body (type: lecture)
#   NN-slug/01-xxx.md  detail (type: detail)

# C. Add a detail to an existing directory-type lecture
content/themes/{theme}/{module}/lessons/NN-parent/NN-new-detail.md
```

Frontmatter template (validation is strict; missing required fields fail `check:content` and the build):

```yaml
---
title: Title
description: Text shown in lists and ::detail cards
order: 1                    # required; display order within the level
type: lecture               # lecture | detail | reference | cheatsheet
category: basics            # optional; a key from _module.json categories[]
difficulty: beginner        # beginner | intermediate | advanced
tags: [git, fundamentals]   # optional
estimatedMinutes: 5         # optional
status: draft               # draft | published | deprecated
---
```

- `order` is required. Normally keep it equal to the file name's `NN-` prefix.
- Keep `type` consistent with placement: top-level file or `index.md` -> `lecture`; under a directory-type lecture -> `detail`. `reference` is a legacy value kept for compatibility; `cheatsheet` is for cheat sheets.
- Start new content as `status: draft`, switch to `published` on release.

## 3. Adding a module

```bash
mkdir -p content/themes/{theme}/NN-module-slug/lessons
```

`_module.json`:

```json
{
  "slug": "NN-module-slug",
  "title": "Module name",
  "description": "Module description",
  "icon": "FileText",
  "order": 1,
  "categories": []
}
```

`categories` is only needed to group lessons: `{ "key": "...", "label": "...", "description": "..." }`.

## 4. Adding a theme

```bash
mkdir -p content/themes/NN-theme-slug
```

`_theme.json`:

```json
{
  "slug": "NN-theme-slug",
  "title": "Theme name",
  "shortTitle": "Short name",
  "description": "Theme description",
  "icon": "BookOpen",
  "color": "blue",
  "order": 1,
  "difficulty": "beginner",
  "estimatedHours": 8,
  "status": "draft"
}
```

`color` is one of the five colors in `lib/theme-color.ts` (`blue` / `green` / `purple` / `orange` / `gray`). Keep `status: "draft"` while writing; omitted `status` means `published`.

## 5. Naming

- Directories and files: `NN-kebab-case` (`01-markdown`, `02-headings.md`).
- The main file of a directory-type lecture is always `index.md`; the `NN-` prefix goes on the parent directory.
- Prefer English slugs, never romanized Japanese (`basics` / `advanced` / `practice`, not `kiso` / `ouyou` / `jissen`).

## 6. URLs and ordering

- Theme and module URL segments **keep** the `NN-` prefix (`01-web-basics`, `01-markdown`). Only lecture/detail (lesson) segments **drop** it.
- Lecture, file-type or directory-type: `/themes/01-web-basics/02-git/intro-basics`. Detail (file `01-what-is-git.md`): `/themes/01-web-basics/02-git/intro-basics/what-is-git`.
- Order comes from the `NN-` prefix for default sorting and from the required frontmatter `order` for display (normally equal to the prefix).

## 7. Publishing flow

```bash
bun run dev   # verify in the browser (drafts visible)
# set status: published -> PR -> check Vercel Preview -> merge to main -> auto deploy
```
