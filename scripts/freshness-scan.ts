/**
 * Stage 1 of the content freshness pipeline: deterministic scan. Costs no tokens.
 *
 * Walks every lesson, masks code regions, extracts claims that can go stale, and
 * emits the subset due for review this run. The LLM stage only ever sees this
 * output, which is what keeps the token cost bounded.
 *
 * Run with: `bun scripts/freshness-scan.ts [options]`
 *
 *   --all                 Scan every candidate instead of this week's bucket
 *   --bucket=N            Force a bucket (default: derived from the current week)
 *   --bucket-count=N      Number of rotation buckets (default 4)
 *   --max=N               Cap the number of lessons returned
 *   --theme=<slug>        Restrict to one theme directory, e.g. 04-ai-driven-development
 *   --format=json|markdown
 *   --include-low         Include low-confidence claims in the Markdown report
 *   --out=<path>          Write to a file instead of stdout
 */

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { extractClaims } from "../lib/content/freshness/extract";
// `internal-links.ts` is imported dynamically, not here — see
// `loadThemesIncludingDrafts` for why. It is the one module in this file's
// dependency graph that statically imports `lib/themes.ts`, which in turn
// pulls in `lib/content/loader.ts`, whose `isProduction` const is fixed at
// module-evaluation time. A static import here would load and freeze it
// before this file's own code — including the NODE_ENV fix below — ever runs
// (import statements are hoisted above everything else in a module).
// `import type` is erased at compile time, so this carries no runtime import.
import type * as InternalLinksModule from "../lib/content/freshness/internal-links";
import { applyIgnoreList, formatMarkdown, parseIgnoreList } from "../lib/content/freshness/report";
import {
  bucketOf,
  selectCandidates,
  selectedBucket,
  weekIndex,
} from "../lib/content/freshness/rotation";
import { isStub, scoreClaims, scoreLesson } from "../lib/content/freshness/score";
import type { InternalLinkIssue, LessonScan, ScanResult } from "../lib/content/freshness/types";
import type { Lesson, Theme } from "../lib/content/loader";

const DEFAULT_BUCKET_COUNT = 4;
const RECENT_WINDOW_DAYS = 7;
const IGNORE_FILE = path.join(process.cwd(), "content", ".freshness-ignore");

interface Options {
  all: boolean;
  bucket?: number;
  bucketCount: number;
  max?: number;
  theme?: string;
  format: "json" | "markdown";
  includeLow: boolean;
  out?: string;
}

/**
 * Parse a non-negative integer strictly. `Number.parseInt` silently truncates
 * `"1x"` to `1` and `"4.5"` to `4`, so a typo in `--bucket`/`--bucket-count`/
 * `--max` would otherwise pass validation and silently select the wrong bucket.
 */
function parseStrictInt(flag: string, value: string): number {
  if (!/^\d+$/.test(value)) {
    throw new Error(`${flag} は整数で指定してください（受け取った値: ${value}）`);
  }
  return Number.parseInt(value, 10);
}

function parseArgs(argv: string[]): Options {
  const options: Options = {
    all: false,
    bucketCount: DEFAULT_BUCKET_COUNT,
    format: "json",
    includeLow: false,
  };

  for (const arg of argv) {
    const [key, value] = arg.split("=");
    switch (key) {
      case "--all":
        options.all = true;
        break;
      case "--bucket":
        options.bucket = parseStrictInt("--bucket", value);
        break;
      case "--bucket-count":
        options.bucketCount = parseStrictInt("--bucket-count", value);
        break;
      case "--max":
        options.max = parseStrictInt("--max", value);
        break;
      case "--theme":
        options.theme = value;
        break;
      case "--format":
        if (value !== "json" && value !== "markdown") {
          throw new Error(
            `--format は json か markdown を指定してください（受け取った値: ${value}）`,
          );
        }
        options.format = value;
        break;
      case "--include-low":
        options.includeLow = true;
        break;
      case "--out":
        options.out = value;
        break;
      default:
        throw new Error(`不明なオプション: ${arg}`);
    }
  }

  if (options.bucketCount < 1) {
    throw new Error("--bucket-count は 1 以上の整数で指定してください");
  }
  if (options.bucket !== undefined && options.bucket >= options.bucketCount) {
    throw new Error(
      `--bucket は 0〜${options.bucketCount - 1} の範囲で指定してください（--bucket-count=${options.bucketCount}）`,
    );
  }
  if (options.max !== undefined && options.max < 1) {
    throw new Error("--max は 1 以上の整数で指定してください");
  }
  return options;
}

/**
 * File names under `public/`, which Next.js serves at the site root.
 *
 * These can't be derived from `content/`, so without them a reference such as
 * `/icon.png` would be reported as a broken internal link — and internal link
 * issues carry no fingerprint, so there would be no way to suppress it.
 */
function publicAssets(): string[] {
  try {
    return readdirSync(path.join(process.cwd(), "public"));
  } catch {
    return [];
  }
}

/** Every lesson and detail page in the tree, flattened. */
function flattenLessons(themes: Theme[]): Lesson[] {
  const lessons: Lesson[] = [];
  for (const theme of themes) {
    for (const mod of theme.modules) {
      for (const lesson of mod.lessons) {
        lessons.push(lesson);
        lessons.push(...lesson.details);
      }
    }
  }
  return lessons;
}

/**
 * Repo-relative paths touched in the last {@link RECENT_WINDOW_DAYS} days.
 *
 * One `git log` call rather than one per file. On a shallow clone this returns
 * little or nothing, so the caller warns rather than silently disabling the
 * new-arrivals lane.
 */
function recentlyChangedFiles(warnings: string[]): Set<string> {
  const changed = new Set<string>();

  try {
    const shallow = execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
      encoding: "utf-8",
    }).trim();
    if (shallow === "true") {
      warnings.push(
        "shallow clone のため git 履歴が不完全です。新着レーン（直近7日に変更された記事の優先レビュー）は正しく機能しません。",
      );
    }

    const output = execFileSync(
      "git",
      [
        "log",
        `--since=${RECENT_WINDOW_DAYS} days ago`,
        "--name-only",
        "--pretty=format:",
        "--",
        "content/themes",
      ],
      { encoding: "utf-8" },
    );
    for (const line of output.split("\n")) {
      const trimmed = line.trim();
      if (trimmed) changed.add(trimmed);
    }
  } catch (error) {
    warnings.push(
      `git 履歴を取得できませんでした（新着レーンは無効）: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  return changed;
}

/**
 * Load the content tree guaranteed to include drafts, regardless of the
 * process's `NODE_ENV` — and, with it, `internal-links.ts`, the one module
 * in this file's own dependency graph that would otherwise pull the same
 * loader in statically (see the import comment above).
 *
 * `lib/content/loader.ts` reads `process.env.NODE_ENV` into a module-level
 * constant at import time and skips `status: draft` content whenever it's
 * `"production"` — correct for the website (drafts shouldn't ship), wrong here
 * (this scanner promises to cover every article, draft or not). Rather than
 * changing that shared, whole-app loader, this script clears `NODE_ENV` for
 * its own process *before* the loader module — or anything that imports it —
 * is evaluated. A dynamic `import()` is what makes "before" possible: unlike
 * a static import, it runs in place rather than being hoisted above this
 * function's own code.
 */
async function loadThemesIncludingDrafts(
  warnings: string[],
): Promise<{ themes: Theme[]; internalLinks: typeof InternalLinksModule }> {
  // Next.js declares `NODE_ENV` readonly in its ambient types to discourage
  // mutating it app-wide; this cast is deliberately scoped to this one
  // process-local, restored-in-`finally` assignment, not a general escape hatch.
  const env = process.env as { NODE_ENV?: string };
  const original = env.NODE_ENV;
  if (original === "production") {
    warnings.push(
      "NODE_ENV=production で実行されました。draft を含めて走査するため、このスクリプトの" +
        "プロセス内でのみ NODE_ENV を一時的に外しています（サイト本体の挙動には影響しません）。",
    );
    env.NODE_ENV = "development";
  }
  try {
    const [{ getThemes }, internalLinks] = await Promise.all([
      import("../lib/themes"),
      import("../lib/content/freshness/internal-links"),
    ]);
    return { themes: getThemes(), internalLinks };
  } finally {
    env.NODE_ENV = original;
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const warnings: string[] = [];

  // Call once: loadContentTree is wrapped in React.cache, which is a no-op outside
  // a React request scope, so repeated calls would re-walk content/ every time.
  const { themes, internalLinks } = await loadThemesIncludingDrafts(warnings);
  const { buildValidInternalPaths, findInternalLinkIssues } = internalLinks;
  const validPaths = buildValidInternalPaths(themes, publicAssets());
  const allLessons = flattenLessons(themes);
  const changed = recentlyChangedFiles(warnings);
  const now = new Date();

  const scans: (LessonScan & { recentlyChanged: boolean })[] = [];
  const internalLinkIssues: InternalLinkIssue[] = [];

  for (const lesson of allLessons) {
    const file = path.relative(process.cwd(), lesson.filePath);
    const raw = readFileSync(lesson.filePath, "utf-8");

    // Internal links are cheap, deterministic, and cost no tokens, so they are
    // checked across every article — including when --theme narrows the claim
    // scan. Letting --theme filter these too would quietly contradict the
    // report, which states they cover the whole repository.
    internalLinkIssues.push(...findInternalLinkIssues(file, raw, validPaths));

    if (options.theme && lesson.themeSlug !== options.theme) continue;

    const claims = extractClaims(raw, now);
    const stub = isStub(lesson.body);

    scans.push({
      file,
      themeSlug: lesson.themeSlug,
      moduleSlug: lesson.moduleSlug,
      title: lesson.frontmatter.title,
      draft: lesson.frontmatter.status === "draft",
      stub,
      charCount: raw.length,
      score: scoreLesson(claims, lesson.body),
      bucket: bucketOf(file, options.bucketCount),
      claims,
      recentlyChanged: changed.has(file),
    });
  }

  let ignored = new Set<string>();
  try {
    ignored = parseIgnoreList(readFileSync(IGNORE_FILE, "utf-8"));
  } catch (error) {
    // A missing file is the normal case. Anything else (a permissions problem,
    // say) would silently disable every suppression, so surface it.
    if ((error as NodeJS.ErrnoException)?.code !== "ENOENT") {
      warnings.push(
        `${path.relative(process.cwd(), IGNORE_FILE)} を読めませんでした。抑制リストが効いていません: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  // Re-score after suppression: a score computed from claims that were then
  // ignored would skew the --max cut-off toward articles whose findings were
  // already dismissed.
  const withIgnores = applyIgnoreList(scans, ignored).map((lesson, i) => ({
    ...lesson,
    score: lesson.stub ? 0 : scoreClaims(lesson.claims),
    recentlyChanged: scans[i].recentlyChanged,
  }));

  const candidates = withIgnores.filter(
    (l) => !l.stub && l.claims.some((c) => c.confidence === "high"),
  );

  const weekIdx = weekIndex(now);
  const bucket = options.bucket ?? selectedBucket(weekIdx, options.bucketCount);
  const selected = selectCandidates(candidates, {
    all: options.all,
    bucket,
    max: options.max,
  });

  const urls = [
    ...new Set(
      selected.flatMap((l) => l.claims.filter((c) => c.kind === "url").map((c) => c.value)),
    ),
  ].sort();

  const countClaims = (kind: string): number =>
    candidates.reduce(
      (sum, l) => sum + l.claims.filter((c) => c.kind === kind && c.confidence === "high").length,
      0,
    );

  const result: ScanResult = {
    generatedAt: now.toISOString(),
    weekIndex: weekIdx,
    bucketCount: options.bucketCount,
    selectedBucket: options.all ? null : bucket,
    totals: {
      lessons: withIgnores.length,
      candidates: candidates.length,
      stubs: withIgnores.filter((l) => l.stub).length,
      urlClaims: countClaims("url"),
      uniqueUrls: new Set(
        candidates.flatMap((l) => l.claims.filter((c) => c.kind === "url").map((c) => c.value)),
      ).size,
      versionClaims: countClaims("version"),
      dateClaims: countClaims("date"),
      internalLinkIssues: internalLinkIssues.length,
    },
    lessons: selected.map(({ recentlyChanged: _ignored, ...rest }) => rest),
    urls,
    internalLinkIssues,
    warnings,
  };

  const output =
    options.format === "markdown"
      ? formatMarkdown(result, { includeLow: options.includeLow })
      : JSON.stringify(result, null, 2);

  if (options.out) {
    writeFileSync(options.out, `${output}\n`, "utf-8");
    console.error(
      `✓ ${options.out} に出力しました — 候補 ${result.totals.candidates} 件中 ${result.lessons.length} 件を選択`,
    );
  } else {
    console.log(output);
  }
}

try {
  await main();
} catch (error) {
  // Argument mistakes are the common failure here; a stack trace buries the
  // message that says how to fix them.
  console.error(`✘ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
