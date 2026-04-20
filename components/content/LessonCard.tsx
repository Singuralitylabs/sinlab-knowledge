import Link from "next/link";
import { getThemeColorClasses } from "@/lib/theme-color";
import type { Lesson } from "@/lib/themes";

export interface LessonCardProps {
  lesson: Lesson;
  /** Theme color token (e.g. `"blue"`) for the badge / accent. */
  themeColor: string;
  /** Optional category label to show as a chip. */
  categoryLabel?: string;
}

const TYPE_LABELS: Record<string, string> = {
  lecture: "解説",
  detail: "詳細",
  reference: "リファレンス",
  cheatsheet: "チートシート",
};

function lessonHref(lesson: Lesson): string {
  return `/themes/${lesson.themeSlug}/${lesson.moduleSlug}/${lesson.slug}`;
}

export default function LessonCard({ lesson, themeColor, categoryLabel }: LessonCardProps) {
  const colors = getThemeColorClasses(themeColor);
  const { title, description, type, tags, estimatedMinutes } = lesson.frontmatter;

  return (
    <Link
      href={lessonHref(lesson)}
      className={`group flex h-full flex-col gap-2 rounded-lg border p-4 shadow-sm transition ${colors.bgSoft} ${colors.bgSoftHover} ${colors.border} ${colors.borderHover}`}
    >
      <div className="flex items-center gap-2 text-xs">
        <span
          className={`rounded-full border bg-white px-2 py-0.5 font-medium ${colors.border} ${colors.text}`}
        >
          {TYPE_LABELS[type] ?? type}
        </span>
        {categoryLabel ? (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
            {categoryLabel}
          </span>
        ) : null}
        {estimatedMinutes ? (
          <span className="ml-auto text-gray-500">{estimatedMinutes}分</span>
        ) : null}
      </div>

      <h3 className="text-base font-semibold text-gray-900">{title}</h3>

      {description ? <p className="line-clamp-2 text-sm text-gray-600">{description}</p> : null}

      {tags.length > 0 ? (
        <ul className="mt-1 flex flex-wrap gap-1">
          {tags.slice(0, 4).map((tag) => (
            <li key={tag} className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600">
              #{tag}
            </li>
          ))}
        </ul>
      ) : null}
    </Link>
  );
}
