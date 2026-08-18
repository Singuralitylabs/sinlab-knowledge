import type { ContentModule, Lesson, Theme } from "./themes";

/**
 * View model for the content index (テーマ → モジュール → レッスン), shared by
 * the home page, `/themes` and the per-theme lesson listing.
 *
 * The projection deliberately drops `Lesson.body` (the full Markdown source)
 * and every other heavyweight field: the index only ever renders titles,
 * counts and hrefs. Keeping it a plain-data projection also makes the URL
 * rules unit-testable without touching the filesystem-backed content tree.
 */

export interface ContentIndexLesson {
  slug: string;
  title: string;
  /** `/themes/<themeSlug>/<moduleSlug>/<lessonSlug>` */
  href: string;
  isDraft: boolean;
}

export interface ContentIndexModule {
  slug: string;
  title: string;
  /** `/themes/<themeSlug>/<moduleSlug>` */
  href: string;
  lessonCount: number;
  isDraft: boolean;
  lessons: ContentIndexLesson[];
}

export interface ContentIndexTheme {
  slug: string;
  title: string;
  /** `/themes/<themeSlug>` */
  href: string;
  /** Raw color token from `_theme.json` (resolved by `getThemeColorClasses`). */
  color: string;
  icon?: string;
  moduleCount: number;
  lessonCount: number;
  isDraft: boolean;
  modules: ContentIndexModule[];
}

function projectLesson(lesson: Lesson): ContentIndexLesson {
  return {
    slug: lesson.slug,
    title: lesson.frontmatter.title,
    href: `/themes/${lesson.themeSlug}/${lesson.moduleSlug}/${lesson.slug}`,
    isDraft: lesson.frontmatter.status === "draft",
  };
}

function projectModule(mod: ContentModule, themeSlug: string): ContentIndexModule {
  // `mod.lessons` holds top-level lectures only — detail sub-pages live under
  // `lesson.details` and are intentionally left out of the index.
  const lessons = mod.lessons.map(projectLesson);
  return {
    slug: mod.slug,
    title: mod.meta.title,
    href: `/themes/${themeSlug}/${mod.slug}`,
    lessonCount: lessons.length,
    isDraft: mod.meta.status === "draft",
    lessons,
  };
}

/** Projects the loaded content tree into the index view model. */
export function buildContentIndex(themes: Theme[]): ContentIndexTheme[] {
  return themes.map((theme) => {
    const modules = theme.modules.map((mod) => projectModule(mod, theme.slug));
    return {
      slug: theme.slug,
      title: theme.meta.title,
      href: `/themes/${theme.slug}`,
      color: theme.meta.color,
      icon: theme.meta.icon,
      moduleCount: modules.length,
      lessonCount: modules.reduce((sum, m) => sum + m.lessonCount, 0),
      isDraft: theme.meta.status === "draft",
      modules,
    };
  });
}
