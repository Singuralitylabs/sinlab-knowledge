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
import { extractOrderPrefix, fileNameToSlug } from "./slug";

export interface Lesson {
  slug: string;
  themeSlug: string;
  moduleSlug: string;
  frontmatter: LessonFrontmatter;
  body: string;
  /** Absolute path to the source file (useful for error messages). */
  filePath: string;
  /** URL path segments under /themes (e.g. ["01-web-basics", "01-markdown", "02-headings"]). */
  pathSegments: string[];
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
    const lessonFiles = listMarkdownFiles(lessonsDir);
    const lessons: Lesson[] = [];

    for (const lessonFile of lessonFiles) {
      const filePath = path.join(lessonsDir, lessonFile);
      const source = readFileSync(filePath, "utf-8");
      const { frontmatter, body } = parseLessonSource(source, filePath);
      if (frontmatter.status === "draft" && isProduction) continue;

      const slug = fileNameToSlug(lessonFile);
      lessons.push({
        slug,
        themeSlug: themeDirName,
        moduleSlug: moduleDirName,
        frontmatter,
        body,
        filePath,
        pathSegments: [themeDirName, moduleDirName, slug],
      });
    }

    lessons.sort((a, b) => {
      if (a.frontmatter.order !== b.frontmatter.order) {
        return a.frontmatter.order - b.frontmatter.order;
      }
      return a.slug.localeCompare(b.slug);
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
