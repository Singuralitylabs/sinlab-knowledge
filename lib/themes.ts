import { type ContentModule, type Lesson, loadContentTree, type Theme } from "./content/loader";

export type { ContentModule, Lesson, Theme };

export function getThemes(): Theme[] {
  return loadContentTree().themes;
}

export function getTheme(themeSlug: string): Theme | null {
  return getThemes().find((t) => t.slug === themeSlug) ?? null;
}

export function getModule(themeSlug: string, moduleSlug: string): ContentModule | null {
  const theme = getTheme(themeSlug);
  if (!theme) return null;
  return theme.modules.find((m) => m.slug === moduleSlug) ?? null;
}

export function getLesson(
  themeSlug: string,
  moduleSlug: string,
  lessonSlug: string,
): Lesson | null {
  const mod = getModule(themeSlug, moduleSlug);
  if (!mod) return null;
  return mod.lessons.find((l) => l.slug === lessonSlug) ?? null;
}

export function getAdjacentLessonsInModule(lesson: Lesson): {
  prev: Lesson | null;
  next: Lesson | null;
} {
  const mod = getModule(lesson.themeSlug, lesson.moduleSlug);
  if (!mod) return { prev: null, next: null };
  const idx = mod.lessons.findIndex((l) => l.slug === lesson.slug);
  return {
    prev: idx > 0 ? mod.lessons[idx - 1] : null,
    next: idx >= 0 && idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null,
  };
}

export function getAllLessonPaths(): { themeSlug: string; slug: string[] }[] {
  const paths: { themeSlug: string; slug: string[] }[] = [];
  for (const theme of getThemes()) {
    for (const mod of theme.modules) {
      for (const lesson of mod.lessons) {
        paths.push({ themeSlug: theme.slug, slug: [mod.slug, lesson.slug] });
      }
    }
  }
  return paths;
}

export function getAllModulePaths(): { themeSlug: string; slug: string[] }[] {
  const paths: { themeSlug: string; slug: string[] }[] = [];
  for (const theme of getThemes()) {
    for (const mod of theme.modules) {
      paths.push({ themeSlug: theme.slug, slug: [mod.slug] });
    }
  }
  return paths;
}

export function getLessonsByTag(tag: string): Lesson[] {
  const lessons: Lesson[] = [];
  for (const theme of getThemes()) {
    for (const mod of theme.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.frontmatter.tags.includes(tag)) lessons.push(lesson);
      }
    }
  }
  return lessons;
}
