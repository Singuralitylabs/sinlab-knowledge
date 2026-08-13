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
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { extractClaims } from "../lib/content/freshness/extract";
import {
  buildValidInternalPaths,
  findInternalLinkIssues,
} from "../lib/content/freshness/internal-links";
import { applyIgnoreList, formatMarkdown, parseIgnoreList } from "../lib/content/freshness/report";
import {
  bucketOf,
  selectCandidates,
  selectedBucket,
  weekIndex,
} from "../lib/content/freshness/rotation";
import { isStub, scoreLesson } from "../lib/content/freshness/score";
import type { InternalLinkIssue, LessonScan, ScanResult } from "../lib/content/freshness/types";
import type { Lesson, Theme } from "../lib/content/loader";
import { getThemes } from "../lib/themes";

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
        options.bucket = Number.parseInt(value, 10);
        break;
      case "--bucket-count":
        options.bucketCount = Number.parseInt(value, 10);
        break;
      case "--max":
        options.max = Number.parseInt(value, 10);
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

  if (Number.isNaN(options.bucketCount) || options.bucketCount < 1) {
    throw new Error("--bucket-count は 1 以上の整数で指定してください");
  }
  return options;
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

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const warnings: string[] = [];

  // Call once: loadContentTree is wrapped in React.cache, which is a no-op outside
  // a React request scope, so repeated calls would re-walk content/ every time.
  const themes = getThemes();
  const validPaths = buildValidInternalPaths(themes);
  const allLessons = flattenLessons(themes);
  const changed = recentlyChangedFiles(warnings);
  const now = new Date();

  const scans: (LessonScan & { recentlyChanged: boolean })[] = [];
  const internalLinkIssues: InternalLinkIssue[] = [];

  for (const lesson of allLessons) {
    const file = path.relative(process.cwd(), lesson.filePath);
    if (options.theme && lesson.themeSlug !== options.theme) continue;

    const raw = readFileSync(lesson.filePath, "utf-8");
    const claims = extractClaims(raw, now);
    const stub = isStub(lesson.body);

    // Internal links are cheap and deterministic, so they are always checked
    // across every article rather than sampled by the rotation.
    internalLinkIssues.push(...findInternalLinkIssues(file, raw, validPaths));

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
  } catch {
    // No ignore file yet — nothing to suppress.
  }
  const withIgnores = applyIgnoreList(scans, ignored) as (LessonScan & {
    recentlyChanged: boolean;
  })[];

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

main();
