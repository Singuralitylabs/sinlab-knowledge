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
 * Returns the sibling list that defines the prev/next scope for the given
 * lesson. Top-level lectures navigate among lectures (skipping details);
 * details navigate among their sibling details.
 */
function siblingLessons(lesson: Lesson, mod: ContentModule): Lesson[] {
  if (!lesson.parentSlug) return mod.lessons;
  const parent = mod.lessons.find((l) => l.slug === lesson.parentSlug);
  return parent ? parent.details : [];
}

export function getAdjacentLessonsInModule(lesson: Lesson): {
  prev: Lesson | null;
  next: Lesson | null;
} {
  const mod = getModule(lesson.themeSlug, lesson.moduleSlug);
  if (!mod) return { prev: null, next: null };
  const siblings = siblingLessons(lesson, mod);
  const idx = siblings.findIndex((l) => l.slug === lesson.slug);
  return {
    prev: idx > 0 ? siblings[idx - 1] : null,
    next: idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null,
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
