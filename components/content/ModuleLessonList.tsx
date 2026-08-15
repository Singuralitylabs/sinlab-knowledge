import Link from "next/link";
import DraftBadge from "@/components/content/DraftBadge";
import type { ContentIndexModule } from "@/lib/content-index";
import type { ThemeColorClasses } from "@/lib/theme-color";

export interface ModuleLessonListProps {
  modules: ContentIndexModule[];
  /** Resolved theme accent classes (from `getThemeColorClasses`). */
  colors: ThemeColorClasses;
  /**
   * Wrap each module in a native `<details>` so the lesson list starts hidden.
   * Used where many themes are listed at once (top page / `/themes`); the theme
   * page shows a single theme and lists everything expanded instead.
   *
   * Note that the expanded variant renders the module title as `<h3>`, so it
   * belongs under a page whose own heading is `<h2>` — not inside a listing
   * that already spends `<h3>` on the theme name (as `ContentIndex` does).
   */
  collapsible: boolean;
}

function LessonList({
  module: mod,
  colors,
  collapsible,
}: {
  module: ContentIndexModule;
  colors: ThemeColorClasses;
  collapsible: boolean;
}) {
  return (
    <div className="border-t border-gray-100 px-4 py-3">
      {mod.lessons.length === 0 ? (
        <p className="text-sm text-gray-500">レッスンはまだありません。</p>
      ) : (
        <ul className="space-y-1.5">
          {mod.lessons.map((lesson) => (
            <li key={lesson.slug} className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${colors.bgSolid}`}
                aria-hidden="true"
              />
              <span className="flex flex-wrap items-center gap-2">
                <Link href={lesson.href} className="text-sm text-gray-700 hover:underline">
                  {lesson.title}
                </Link>
                {lesson.isDraft ? <DraftBadge /> : null}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/*
        When collapsed the module title lives inside <summary>, where a link
        would fight the toggle — so the module page gets its own link here.
        The expanded variant links the title directly and needs no extra row.
      */}
      {collapsible ? (
        <p className="mt-3">
          <Link href={mod.href} className={`text-xs font-medium hover:underline ${colors.text}`}>
            モジュールのページを見る →
          </Link>
        </p>
      ) : null}
    </div>
  );
}

/**
 * Module rows with their lessons, shared by the collapsible content index and
 * the always-expanded theme-page listing.
 *
 * Server Component: collapsing is native `<details>`/`<summary>`, so no client
 * JS is involved in either variant.
 */
export default function ModuleLessonList({ modules, colors, collapsible }: ModuleLessonListProps) {
  if (modules.length === 0) {
    return <p className="text-sm text-gray-500">モジュールはまだありません。</p>;
  }

  return (
    <ul className="space-y-2">
      {modules.map((mod) => (
        <li key={mod.slug}>
          {collapsible ? (
            <details className="group rounded-lg border border-gray-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform group-open:rotate-90"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4.5 2.5 8 6l-3.5 3.5" />
                </svg>
                <span className="min-w-0 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{mod.title}</span>
                  {mod.isDraft ? <DraftBadge /> : null}
                </span>
                <span className="ml-auto shrink-0 text-xs text-gray-500">
                  {mod.lessonCount} レッスン
                </span>
              </summary>
              <LessonList module={mod} colors={colors} collapsible />
            </details>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-2 px-4 py-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    <Link href={mod.href} className="hover:underline">
                      {mod.title}
                    </Link>
                  </h3>
                  {mod.isDraft ? <DraftBadge /> : null}
                </div>
                <span className="ml-auto shrink-0 text-xs text-gray-500">
                  {mod.lessonCount} レッスン
                </span>
              </div>
              <LessonList module={mod} colors={colors} collapsible={false} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
