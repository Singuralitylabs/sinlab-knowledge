import Link from "next/link";
import type { Lesson } from "@/lib/themes";

export interface LessonNavProps {
  prev: Lesson | null;
  next: Lesson | null;
}

function lessonHref(lesson: Lesson): string {
  const base = `/themes/${lesson.themeSlug}/${lesson.moduleSlug}`;
  return lesson.parentSlug
    ? `${base}/${lesson.parentSlug}/${lesson.slug}`
    : `${base}/${lesson.slug}`;
}

/**
 * Renders previous/next links between lessons within the same module. When a
 * neighbour is missing the slot is omitted entirely (no empty placeholder
 * pushing the remaining link out of position).
 */
export default function LessonNav({ prev, next }: LessonNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="モジュール内の前後リンク"
      className="mt-12 grid gap-3 border-t border-gray-200 pt-6 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={lessonHref(prev)}
          className="group flex flex-col gap-1 rounded-lg border border-gray-200 px-4 py-3 transition hover:border-blue-400 hover:bg-blue-50/50"
        >
          <span className="text-xs uppercase tracking-wider text-gray-500 group-hover:text-blue-700">
            ← 前のレッスン
          </span>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {prev.frontmatter.title}
          </span>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={lessonHref(next)}
          className={`group flex flex-col gap-1 rounded-lg border border-gray-200 px-4 py-3 transition hover:border-blue-400 hover:bg-blue-50/50 sm:text-right ${
            prev ? "" : "sm:col-start-2"
          }`}
        >
          <span className="text-xs uppercase tracking-wider text-gray-500 group-hover:text-blue-700">
            次のレッスン →
          </span>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {next.frontmatter.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
