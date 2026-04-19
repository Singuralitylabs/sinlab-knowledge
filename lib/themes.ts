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

/** Returns a top-level lecture in a module (file-type or directory-type). */
export function getLesson(
  themeSlug: string,
  moduleSlug: string,
  lessonSlug: string,
): Lesson | null {
  const mod = getModule(themeSlug, moduleSlug);
  if (!mod) return null;
  return mod.lessons.find((l) => l.slug === lessonSlug) ?? null;
}

/** Returns a detail sub-page under a directory-type lecture. */
export function getDetail(
  themeSlug: string,
  moduleSlug: string,
  lectureSlug: string,
  detailSlug: string,
): Lesson | null {
  const lecture = getLesson(themeSlug, moduleSlug, lectureSlug);
  if (!lecture) return null;
  return lecture.details.find((d) => d.slug === detailSlug) ?? null;
}

/**
 * Flatten a module's lessons into reading order (each lecture followed by its
 * details). Used for prev/next navigation that traverses both lectures and
 * their detail sub-pages.
 */
function flattenModuleLessons(mod: ContentModule): Lesson[] {
  const flat: Lesson[] = [];
  for (const lesson of mod.lessons) {
    flat.push(lesson);
    for (const detail of lesson.details) flat.push(detail);
  }
  return flat;
}

/**
 * Matches a lesson within a module either by its top-level slug or by the
 * (parentSlug, slug) pair for details.
 */
function isSameLesson(a: Lesson, b: Lesson): boolean {
  return (
    a.themeSlug === b.themeSlug &&
    a.moduleSlug === b.moduleSlug &&
    a.parentSlug === b.parentSlug &&
    a.slug === b.slug
  );
}

export function getAdjacentLessonsInModule(lesson: Lesson): {
  prev: Lesson | null;
  next: Lesson | null;
} {
  const mod = getModule(lesson.themeSlug, lesson.moduleSlug);
  if (!mod) return { prev: null, next: null };
  const flat = flattenModuleLessons(mod);
  const idx = flat.findIndex((l) => isSameLesson(l, lesson));
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}

export function getAllLessonPaths(): { themeSlug: string; slug: string[] }[] {
  const paths: { themeSlug: string; slug: string[] }[] = [];
  for (const theme of getThemes()) {
    for (const mod of theme.modules) {
      for (const lesson of mod.lessons) {
        paths.push({ themeSlug: theme.slug, slug: [mod.slug, lesson.slug] });
        for (const detail of lesson.details) {
          paths.push({ themeSlug: theme.slug, slug: [mod.slug, lesson.slug, detail.slug] });
        }
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
        for (const detail of lesson.details) {
          if (detail.frontmatter.tags.includes(tag)) lessons.push(detail);
        }
      }
    }
  }
  return lessons;
}
