import Link from "next/link";
import type { ContentModule, Lesson } from "@/lib/themes";

export interface SidebarProps {
  themeSlug: string;
  module: ContentModule;
  /** Current lesson slug to highlight (lecture or detail). */
  currentLessonSlug?: string;
}

interface CategoryGroup {
  key: string | null;
  label: string;
  description?: string;
  lessons: Lesson[];
}

function groupLessonsByCategory(module: ContentModule): CategoryGroup[] {
  const categories = module.meta.categories ?? [];

  if (categories.length === 0) {
    return [{ key: null, label: module.meta.title, lessons: module.lessons }];
  }

  const buckets = new Map<string, CategoryGroup>();
  for (const category of categories) {
    buckets.set(category.key, {
      key: category.key,
      label: category.label,
      description: category.description,
      lessons: [],
    });
  }

  const uncategorized: Lesson[] = [];
  for (const lesson of module.lessons) {
    const key = lesson.frontmatter.category;
    const bucket = key ? buckets.get(key) : undefined;
    if (bucket) {
      bucket.lessons.push(lesson);
    } else {
      uncategorized.push(lesson);
    }
  }

  const groups: CategoryGroup[] = [];
  // Preserve declared category order.
  for (const category of categories) {
    const group = buckets.get(category.key);
    if (group && group.lessons.length > 0) groups.push(group);
  }
  if (uncategorized.length > 0) {
    groups.push({ key: null, label: "その他", lessons: uncategorized });
  }
  return groups;
}

function lectureHref(themeSlug: string, lesson: Lesson): string {
  return `/themes/${themeSlug}/${lesson.moduleSlug}/${lesson.slug}`;
}

function detailHref(themeSlug: string, parentSlug: string, detail: Lesson): string {
  return `/themes/${themeSlug}/${detail.moduleSlug}/${parentSlug}/${detail.slug}`;
}

export default function Sidebar({ themeSlug, module, currentLessonSlug }: SidebarProps) {
  const groups = groupLessonsByCategory(module);
  const moduleHref = `/themes/${themeSlug}/${module.slug}`;

  return (
    <nav aria-label="モジュール内の目次" className="text-sm">
      <Link
        href={moduleHref}
        className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-300"
      >
        {module.meta.title}
      </Link>

      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.key ?? "_none"}>
            {groups.length > 1 || group.key !== null ? (
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                {group.label}
              </p>
            ) : null}
            <ul className="space-y-0.5 border-l border-gray-800">
              {group.lessons.map((lesson) => {
                const isLectureActive = lesson.slug === currentLessonSlug;
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={lectureHref(themeSlug, lesson)}
                      aria-current={isLectureActive ? "page" : undefined}
                      className={`-ml-px block border-l py-1.5 pl-3 transition ${
                        isLectureActive
                          ? "border-blue-400 font-semibold text-blue-300"
                          : "border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200"
                      }`}
                    >
                      {lesson.frontmatter.title}
                    </Link>
                    {lesson.details.length > 0 ? (
                      <ul className="space-y-0.5 border-l border-gray-800 pl-3">
                        {lesson.details.map((detail) => {
                          const isDetailActive = detail.slug === currentLessonSlug;
                          return (
                            <li key={detail.slug}>
                              <Link
                                href={detailHref(themeSlug, lesson.slug, detail)}
                                aria-current={isDetailActive ? "page" : undefined}
                                className={`-ml-px block border-l py-1 pl-3 text-[13px] transition ${
                                  isDetailActive
                                    ? "border-blue-400 font-semibold text-blue-300"
                                    : "border-transparent text-gray-500 hover:border-gray-600 hover:text-gray-200"
                                }`}
                              >
                                {detail.frontmatter.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
