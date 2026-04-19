import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parseLessonSource } from "./frontmatter";
import {
  type LessonFrontmatter,
  type ModuleMeta,
  moduleMetaSchema,
  type ThemeMeta,
  themeMetaSchema,
} from "./schema";
import { extractOrderPrefix, toUrlSlug } from "./slug";

export interface Lesson {
  /** URL-facing slug (NN- prefix stripped). Unique within its parent scope. */
  slug: string;
  themeSlug: string;
  moduleSlug: string;
  /** Parent lecture slug when this Lesson is a detail (sub-page). */
  parentSlug?: string;
  frontmatter: LessonFrontmatter;
  body: string;
  /** Absolute path to the source file (useful for error messages). */
  filePath: string;
  /** URL path segments under /themes (e.g. ["01-web-basics", "02-git", "intro-basics", "what-is-git"]). */
  pathSegments: string[];
  /** Detail sub-pages when this lecture is directory-type. Empty array for file-type lectures / details. */
  details: Lesson[];
}

export interface ContentModule {
  slug: string;
  themeSlug: string;
  meta: ModuleMeta;
  lessons: Lesson[];
}

export interface Theme {
  slug: string;
  meta: ThemeMeta;
  modules: ContentModule[];
}

export interface ContentTree {
  themes: Theme[];
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const THEMES_DIR = path.join(CONTENT_DIR, "themes");

const isProduction = process.env.NODE_ENV === "production";

function readJson<T>(filePath: string): T {
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function listDirs(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((name) => !name.startsWith("_") && !name.startsWith("."))
      .filter((name) => {
        const full = path.join(dir, name);
        return statSync(full).isDirectory();
      })
      .sort();
  } catch {
    return [];
  }
}

function listMarkdownFiles(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
      .sort();
  } catch {
    return [];
  }
}

interface LessonLoadContext {
  themeSlug: string;
  moduleSlug: string;
}

/** Parse a single .md file into a Lesson (without details). */
function loadLessonFile(
  filePath: string,
  fileName: string,
  ctx: LessonLoadContext,
  pathSegments: string[],
  parentSlug?: string,
): Lesson | null {
  const source = readFileSync(filePath, "utf-8");
  const { frontmatter, body } = parseLessonSource(source, filePath);
  if (frontmatter.status === "draft" && isProduction) return null;
  const urlSlug = toUrlSlug(fileName);
  return {
    slug: urlSlug,
    themeSlug: ctx.themeSlug,
    moduleSlug: ctx.moduleSlug,
    parentSlug,
    frontmatter,
    body,
    filePath,
    pathSegments,
    details: [],
  };
}

/** Sort lessons (or details) by frontmatter.order then by slug. */
function sortLessons(list: Lesson[]): Lesson[] {
  return list.sort((a, b) => {
    if (a.frontmatter.order !== b.frontmatter.order) {
      return a.frontmatter.order - b.frontmatter.order;
    }
    return a.slug.localeCompare(b.slug);
  });
}

/**
 * Load all lessons under a module's `lessons/` dir.
 *
 * Supports two layouts per entry:
 *   (A) `NN-slug.md`        — file-type lecture (no details)
 *   (B) `NN-slug/index.md`  — directory-type lecture; sibling `NN-*.md` become details
 */
function loadLessonsForModule(lessonsDir: string, ctx: LessonLoadContext): Lesson[] {
  const lessons: Lesson[] = [];

  let entries: string[];
  try {
    entries = readdirSync(lessonsDir);
  } catch {
    return lessons;
  }

  for (const entry of entries) {
    if (entry.startsWith("_") || entry.startsWith(".")) continue;
    const entryPath = path.join(lessonsDir, entry);
    const stat = statSync(entryPath);

    if (stat.isFile() && entry.endsWith(".md")) {
      // File-type lecture
      const lessonUrlSlug = toUrlSlug(entry);
      const lesson = loadLessonFile(entryPath, entry, ctx, [
        ctx.themeSlug,
        ctx.moduleSlug,
        lessonUrlSlug,
      ]);
      if (lesson) lessons.push(lesson);
    } else if (stat.isDirectory()) {
      // Directory-type lecture: require index.md
      const indexPath = path.join(entryPath, "index.md");
      let lectureSlug: string;
      let lecture: Lesson | null = null;
      try {
        statSync(indexPath); // throws if missing
        lectureSlug = toUrlSlug(entry);
        lecture = loadLessonFile(
          indexPath,
          "index.md",
          ctx,
          [ctx.themeSlug, ctx.moduleSlug, lectureSlug],
          undefined,
        );
        if (!lecture) continue;
        // Preserve the directory slug (index.md would resolve to "index" via toUrlSlug)
        lecture.slug = lectureSlug;
      } catch {
        // No index.md — skip this directory
        continue;
      }

      // Load sibling .md files as details
      const detailFiles = listMarkdownFiles(entryPath).filter((f) => f !== "index.md");
      const details: Lesson[] = [];
      for (const detailFile of detailFiles) {
        const detailPath = path.join(entryPath, detailFile);
        const detailUrlSlug = toUrlSlug(detailFile);
        const detail = loadLessonFile(
          detailPath,
          detailFile,
          ctx,
          [ctx.themeSlug, ctx.moduleSlug, lectureSlug, detailUrlSlug],
          lectureSlug,
        );
        if (detail) details.push(detail);
      }
      lecture.details = sortLessons(details);
      lessons.push(lecture);
    }
  }

  return sortLessons(lessons);
}

function loadTheme(themeDirName: string): Theme | null {
  const themeDir = path.join(THEMES_DIR, themeDirName);
  const metaPath = path.join(themeDir, "_theme.json");
  const meta = themeMetaSchema.parse(readJson(metaPath));
  if (meta.status === "draft" && isProduction) return null;

  const moduleDirs = listDirs(themeDir);
  const modules: ContentModule[] = [];

  for (const moduleDirName of moduleDirs) {
    const moduleDir = path.join(themeDir, moduleDirName);
    const moduleMetaPath = path.join(moduleDir, "_module.json");
    const moduleMeta = moduleMetaSchema.parse(readJson(moduleMetaPath));
    if (moduleMeta.status === "draft" && isProduction) continue;

    const lessonsDir = path.join(moduleDir, "lessons");
    const lessons = loadLessonsForModule(lessonsDir, {
      themeSlug: themeDirName,
      moduleSlug: moduleDirName,
    });

    modules.push({ slug: moduleDirName, themeSlug: themeDirName, meta: moduleMeta, lessons });
  }

  modules.sort((a, b) => {
    if (a.meta.order !== b.meta.order) return a.meta.order - b.meta.order;
    const ax = extractOrderPrefix(a.slug) ?? 0;
    const bx = extractOrderPrefix(b.slug) ?? 0;
    return ax - bx;
  });

  return { slug: themeDirName, meta, modules };
}

export const loadContentTree = cache((): ContentTree => {
  const themeDirs = listDirs(THEMES_DIR);
  const themes: Theme[] = [];
  for (const dir of themeDirs) {
    const theme = loadTheme(dir);
    if (theme) themes.push(theme);
  }
  themes.sort((a, b) => a.meta.order - b.meta.order);
  return { themes };
});
