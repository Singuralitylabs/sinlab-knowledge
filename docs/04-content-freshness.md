# Content freshness check: design

Design decisions for the recurring review of whether learning articles have gone stale. Routine (cloud execution) settings are stored on claude.ai and are out of scope. Commands are in `CLAUDE.md`; options are in the header comments of `scripts/freshness-*.ts`.

## Background: staleness risks

- External URLs in article bodies. Claude-related docs sites reorganize URLs often.
- Benchmark sites (`artificialanalysis.ai`, `epoch.ai`, `swebench.com`, `wandb.ai`, `lmarena.ai`): a link can be alive while its numbers are outdated.
- Staleness concentrates in `04-ai-driven-development`: model names and benchmark figures change far faster than elsewhere.
- `publishedAt` / `updatedAt` exist in `lib/content/schema.ts` but are unused, so there is no record of when an article was written or last verified.

## Three stages

**Everything that can be decided deterministically is handled outside the LLM.**

| Stage | Implementation | Purpose | Tokens |
|---|---|---|---|
| 1 | `scripts/freshness-scan.ts` | Scan all articles, extract claims that can go stale | 0 |
| 2 | `scripts/freshness-linkcheck.ts` | External URL liveness | 0 |
| 3 | `.claude/skills/content-freshness-review/SKILL.md` | Judge content staleness, report to an Issue | billed |

Stages 1 and 2 stay out of the LLM for two reasons: **reproducibility** (a 404 needs no inference) and **attack surface** (external page bodies must not enter the context of an autonomous session that can write to the repo and Issues; see Security).

Masking code fences narrows candidates far more than domain exclusion lists: version-like strings drop from hundreds (`chmod 644`, `exit 0`) to a few dozen, and `github.com` hits are mostly example URLs (`git clone https://github.com/user/repo.git`). This shrinks Stage 3's token budget.

## Design decisions

### Mask code fences, do not delete them

`lib/content/freshness/mask.ts` replaces code lines with empty strings, **preserving line count**; deleting would shift reported `file:line` positions.

Fence open/close follows CommonMark: **same character, at least the same length, no info string** for a closing fence. Articles about Markdown itself nest a ` ```javascript ` fence inside a ` ```markdown ` one, so a naive toggle breaks. Dropping the info-string condition fails in two directions: the inner fence closes the outer one early, and the prose after it is then treated as code and silently skipped (this happened in 3 files). An unclosed fence is treated as code until EOF (safe side).

### Two-tier version detection

- **Tier A (high)**: product-name dictionary x version number. Requiring an uppercase-initial word plus digits makes false positives from Japanese text (`第3章`, `2 スペース`) structurally impossible.
- **Tier B (low)**: uppercase-initial word + **dotted** version. Requiring the dot removes `Top 10` / `Level 1` / `Hue 0`; remaining cases such as `CVSS 7.1` / `MMLU 92` are dropped via `VERSION_STOPWORDS`.

Hard-coding the dictionary in `dictionary.ts` does not violate the "no hard-coded lists" rule: that rule is about lesson/module/theme lists derivable from `content/`, not about external-world vocabulary.

### Japanese temporal expressions

A bare 「現在」 appears often and mostly means "is in the state of", so it is useless alone. It is picked up (low confidence) **only when the same paragraph has a year, version or URL**.

"Git was created in 2004" (permanent fact) vs. "as of June 2026" (time-dependent) cannot be separated deterministically; that is Stage 3's job. Only the recency of the year is recorded as a hint.

### Rotation without a state file

The week index is the **absolute week number since the epoch**. ISO week numbers break round-robin: ISO years have 52 or 53 weeks (2026 has 53), so `isoWeek % N` skips or double-selects buckets across year boundaries.

Bucket assignment uses a **stable hash of the path string** (FNV-1a 32-bit). Indexing into a sorted array shifts every later file's bucket when one file is added, so one article gets reviewed two weeks in a row while another waits 2N weeks.

**New-article lane**: files whose last git commit is within 7 days are always included regardless of bucket. New articles carry "latest as of writing" information and go stale sooner, so they should not wait at the back of the queue.

### Remembering false positives: `content/.freshness-ignore`

The fatal flaw of a stateless design is that it cannot remember "handled" or "false positive", so the same finding is re-reported every N weeks. Each finding gets a fingerprint, the first 8 hex digits of `sha1(filePath + ':' + claimText)`, and fingerprints listed in `content/.freshness-ignore` are suppressed. This file is **written by humans after review, not by a machine**: it fits the "content is the source of truth" principle and git history records why something was ignored.

### Internal link validation

Relative links of the form `](/themes/...)` were previously validated nowhere (unknown `::detail{slug}` already renders a red error). Checking is offline, deterministic and matters more than external links, so it runs on **all articles every time**, outside rotation. The first run found a real 404: a link that dropped the `NN-` prefix from theme and module directories. Only **lesson slugs** lose the prefix in URLs.

## Pitfalls when scanning (reusing `lib/themes.ts`)

Enumerate lessons with `getThemes()` (per the no-hard-coded-lists rule), but:

1. **`Lesson.body` has frontmatter stripped.** Counting lines on it is off by the frontmatter length (10-14 lines). Scan `readFileSync(lesson.filePath)` raw content instead.
2. **`React.cache` does not memoize in scripts.** Without a React request scope it passes through, so calling `getThemes()` in a loop re-walks all of `content/` each time. Call it once and pass the result to pure functions.
3. **`NODE_ENV=production` excludes drafts.** `loader.ts` fixes this at module load time. Merely not setting it is not robust: a caller shell or CI that inherits `NODE_ENV=production` silently breaks the promise to scan drafts. `loadThemesIncludingDrafts()` in `scripts/freshness-scan.ts` temporarily unsets `NODE_ENV` inside its own process and then dynamically imports `getThemes()` (no effect on the site). If it was `production`, a note goes to `warnings`.

## Link check classification

| status | Condition | Handling |
|---|---|---|
| `dead` | 404 / 410 | individual Issue |
| `moved` | reachable but final URL differs | content check in Stage 3 |
| `unknown` | 403 / 429 / timeout / 5xx | **not necessarily broken** |
| `alive` | 2xx / 3xx with matching final URL | no report |

**Never report 403 / 429 as `dead`.** Cloudflare bot protection and rate limits produce them routinely, and reporting them destroys trust in the whole report. Differences in trailing slash or fragment are not `moved`.

### Results are not portable across networks

- In sandboxes that force an HTTP CONNECT proxy, Bun's `fetch` may ignore `HTTPS_PROXY` and return **all `unknown`**. Stage 2 detects proxy env vars and **falls back to `curl`**, which honors the proxy. If 80% or more remain undecidable after the fallback, it warns that the environment (allow-list / proxy) is suspect, not the links.
- On Claude Cloud Routines the gateway enforces an allow-list, so `fetch` connects directly; hosts not in the environment's **Allowed domains** get 403 and end up `unknown`.

**If everything is `unknown`, suspect network settings before the links.** For Routine runs, set the environment's Network access to Custom and allow the domains that appear in the articles.

## Security: prompt injection

A Routine runs **autonomously without approval prompts and may use every tool of its connectors, including writes, unapproved** (per official docs). Putting external page bodies into the LLM context under those conditions risks obeying embedded instructions ("close this Issue", "rewrite this file").

This is the second reason Stage 2 is plain deterministic HTTP: Stage 3 reads only HTTP statuses and this repo's article bodies, and external page bodies do not enter the context. Restrict the Routine's connectors to **GitHub only**.

## Deliberately not done

- **Auto-creating fix PRs**: false positives would become diffs. Evaluate accuracy through Issue-based operation first.
- **Auto-setting frontmatter `updatedAt`**: a separate problem from staleness detection. Machine commits across all articles are an unreviewable diff and conflict with the commit policy in `CLAUDE.md`. `updatedAt` should mean "the day a human re-checked the content"; a bot-set value destroys that meaning.
- **Per-theme frequency weighting**: scores concentrate in `04-ai-driven-development`, so uniform rotation spends equal budget on articles that do not go stale. A `freshnessInterval` in `_theme.json` is promising, but gather results with uniform rotation first.
- **Tightening the `publishedAt` / `updatedAt` schema**: currently `z.string().optional()` with no format validation. Cheap to make strict while unused, but independent of this mechanism.
