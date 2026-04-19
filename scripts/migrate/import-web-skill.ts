/**
 * Migrate the legacy web-skill-lessons (Markdown + Git) docs into the
 * Sinlab Knowledge `content/themes/01-web-basics/` tree.
 *
 * Usage:
 *   bun scripts/migrate/import-web-skill.ts
 *
 * The script is idempotent: re-running it overwrites the generated lesson
 * files in-place. It validates every produced file against the lesson
 * frontmatter zod schema and prints a summary at the end.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseLessonSource } from "../../lib/content/frontmatter";
import type { LessonFrontmatter } from "../../lib/content/schema";
import { GIT_ENTRIES, MARKDOWN_ENTRIES, type MigrationEntry } from "./shared/filename";
import { renderFrontmatter } from "./shared/frontmatter";

const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const LEGACY_ROOT = "/Users/yamada/Documents/future_tech/lessons/web-skill-lessons/docs";

const MARKDOWN_SRC = path.join(LEGACY_ROOT, "01_markdown");
const GIT_SRC = path.join(LEGACY_ROOT, "02_git");

const THEME_DIR = path.join(PROJECT_ROOT, "content", "themes", "01-web-basics");
const MARKDOWN_OUT = path.join(THEME_DIR, "01-markdown", "lessons");
const GIT_OUT = path.join(THEME_DIR, "02-git", "lessons");

interface RunStats {
  written: string[];
  warnings: string[];
  errors: string[];
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function extractTitleFromBody(body: string): string | null {
  const match = body.match(/^#\s+(.+?)\s*$/m);
  return match ? match[1].trim() : null;
}

function migrateEntry(
  entry: MigrationEntry,
  sourceDir: string,
  targetDir: string,
  stats: RunStats,
): void {
  const sourcePath = path.join(sourceDir, entry.sourceRel);
  const targetPath = path.join(targetDir, entry.targetFile);

  if (!existsSync(sourcePath)) {
    stats.warnings.push(`source not found: ${sourcePath} -> skip ${entry.targetFile}`);
    return;
  }

  const source = readFileSync(sourcePath, "utf-8");
  const detectedTitle = extractTitleFromBody(source);
  const title = entry.titleOverride ?? detectedTitle ?? entry.targetFile.replace(/\.md$/, "");

  const fm: LessonFrontmatter = {
    title,
    order: entry.order,
    type: entry.type,
    category: entry.category,
    difficulty: entry.difficulty,
    tags: entry.tags,
    estimatedMinutes: entry.estimatedMinutes,
    status: entry.status ?? "published",
    relatedLessons: [],
    authors: [],
  };

  const body = source.endsWith("\n") ? source : `${source}\n`;
  const output = `${renderFrontmatter(fm)}${body}`;

  // Validate before writing so we fail fast on schema regressions.
  try {
    parseLessonSource(output, targetPath);
  } catch (err) {
    stats.errors.push(`schema validation failed for ${targetPath}: ${(err as Error).message}`);
    return;
  }

  writeFileSync(targetPath, output, "utf-8");
  stats.written.push(path.relative(PROJECT_ROOT, targetPath));
}

function writeJson(targetPath: string, value: unknown): void {
  ensureDir(path.dirname(targetPath));
  writeFileSync(targetPath, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}

function ensureThemeJson(): void {
  const themeJsonPath = path.join(THEME_DIR, "_theme.json");
  // Keep the existing theme description; only ensure required fields are present.
  const current = existsSync(themeJsonPath)
    ? (JSON.parse(readFileSync(themeJsonPath, "utf-8")) as Record<string, unknown>)
    : {};
  const next = {
    slug: "01-web-basics",
    title: "Web基礎",
    shortTitle: "Web基礎",
    description: "MarkdownとGit。すべての出発点となる必須スキルを体系的に学ぶ。",
    icon: "BookOpen",
    color: "blue",
    order: 1,
    difficulty: "beginner",
    estimatedHours: 8,
    ...current,
  };
  writeJson(themeJsonPath, next);
}

function ensureMarkdownModuleJson(): void {
  const moduleJsonPath = path.join(THEME_DIR, "01-markdown", "_module.json");
  const value = {
    slug: "01-markdown",
    title: "Markdown",
    description: "Markdown記法を3カテゴリ (基礎/応用/拡張) で体系的に学習",
    icon: "FileText",
    order: 1,
    categories: [
      { key: "kiso", label: "基礎編", description: "見出し、リスト、リンクなど" },
      { key: "ouyou", label: "応用編", description: "折りたたみ、脚注、数式など" },
      { key: "kakucho", label: "拡張編", description: "ハイライト、diff構文など" },
    ],
  };
  writeJson(moduleJsonPath, value);
}

function ensureGitModuleJson(): void {
  const moduleJsonPath = path.join(THEME_DIR, "02-git", "_module.json");
  const value = {
    slug: "02-git",
    title: "Git",
    description: "Gitとチーム開発を、解説記事7本と個別リファレンス24本で体系的に学習",
    icon: "GitBranch",
    order: 2,
    categories: [
      { key: "kiso", label: "基礎編", description: "Gitの基本コマンドとブランチ" },
      { key: "jissen", label: "実践編", description: "プルリクエスト、リベース、レビュー" },
      { key: "ouyou", label: "応用編", description: "履歴操作、スタッシュ、設定" },
      { key: "team", label: "チーム開発編", description: "ブランチ戦略、Issue、CI/CD" },
    ],
  };
  writeJson(moduleJsonPath, value);
}

function main(): void {
  const stats: RunStats = { written: [], warnings: [], errors: [] };

  ensureThemeJson();
  ensureMarkdownModuleJson();
  ensureGitModuleJson();
  ensureDir(MARKDOWN_OUT);
  ensureDir(GIT_OUT);

  for (const entry of MARKDOWN_ENTRIES) {
    migrateEntry(entry, MARKDOWN_SRC, MARKDOWN_OUT, stats);
  }
  for (const entry of GIT_ENTRIES) {
    migrateEntry(entry, GIT_SRC, GIT_OUT, stats);
  }

  console.log(`\nMigration complete.`);
  console.log(`  written:  ${stats.written.length} files`);
  console.log(`  warnings: ${stats.warnings.length}`);
  console.log(`  errors:   ${stats.errors.length}`);

  if (stats.warnings.length > 0) {
    console.log(`\nWarnings:`);
    for (const w of stats.warnings) console.log(`  - ${w}`);
  }
  if (stats.errors.length > 0) {
    console.log(`\nErrors:`);
    for (const e of stats.errors) console.log(`  - ${e}`);
    process.exitCode = 1;
  }
}

main();
