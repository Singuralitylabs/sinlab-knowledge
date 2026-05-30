import type { ContentModule, Lesson, Theme } from "@/lib/content/loader";
import type { LessonFrontmatter, ModuleMeta, ThemeMeta } from "@/lib/content/schema";

/** Build a valid LessonFrontmatter with sensible defaults for tests. */
export function makeFrontmatter(overrides: Partial<LessonFrontmatter> = {}): LessonFrontmatter {
  return {
    title: "Lesson",
    order: 1,
    type: "lecture",
    difficulty: "beginner",
    tags: [],
    status: "published",
    relatedLessons: [],
    authors: [],
    ...overrides,
  };
}

interface LessonOpts {
  themeSlug?: string;
  moduleSlug?: string;
  parentSlug?: string;
  details?: Lesson[];
  frontmatter?: Partial<LessonFrontmatter>;
}

/** Build an in-memory Lesson without touching the filesystem. */
export function makeLesson(slug: string, opts: LessonOpts = {}): Lesson {
  const themeSlug = opts.themeSlug ?? "01-theme";
  const moduleSlug = opts.moduleSlug ?? "01-module";
  return {
    slug,
    themeSlug,
    moduleSlug,
    parentSlug: opts.parentSlug,
    frontmatter: makeFrontmatter(opts.frontmatter),
    body: "",
    filePath: `/content/${slug}.md`,
    pathSegments: [themeSlug, moduleSlug, slug],
    details: opts.details ?? [],
  };
}

export function makeModule(
  slug: string,
  lessons: Lesson[],
  meta: Partial<ModuleMeta> = {},
): ContentModule {
  return {
    slug,
    themeSlug: "01-theme",
    meta: {
      slug,
      title: "Module",
      description: "",
      order: 1,
      categories: [],
      status: "published",
      ...meta,
    },
    lessons,
  };
}

export function makeTheme(
  slug: string,
  modules: ContentModule[],
  meta: Partial<ThemeMeta> = {},
): Theme {
  return {
    slug,
    meta: {
      slug,
      title: "Theme",
      description: "",
      color: "#000000",
      order: 1,
      difficulty: "beginner",
      status: "published",
      ...meta,
    },
    modules,
  };
}
