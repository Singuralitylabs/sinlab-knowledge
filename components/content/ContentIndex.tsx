import Link from "next/link";
import { buildContentIndex } from "@/lib/content-index";
import { getThemeColorClasses, iconFallback } from "@/lib/theme-color";
import type { Theme } from "@/lib/themes";

export interface ContentIndexProps {
  themes: Theme[];
}

/** Small "執筆予定" pill, matching the badge used on `ThemeCard`. */
function DraftBadge() {
  return (
    <span className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">
      執筆予定
    </span>
  );
}

/**
 * Top-page content index: テーマ → モジュール（折りたたみ）→ レッスン。
 *
 * Server Component by design — the collapsing is native `<details>`/`<summary>`,
 * so the home page stays statically rendered with no client JS.
 *
 * Draft entries only ever appear in dev (the loader strips them in production
 * builds). Whether a draft entry is linked follows the card it mirrors, so both
 * routes into the content behave the same: draft themes are unlinked (as in
 * `ThemeCard`), while draft modules / lessons stay linked (as in `ModuleCard` /
 * `LessonCard`, which link drafts and are reachable from the theme page in dev).
 * The "執筆予定" badge itself is index-only — those cards do not carry one.
 */
export default function ContentIndex({ themes }: ContentIndexProps) {
  const index = buildContentIndex(themes);

  return (
    <section aria-labelledby="content-index-heading" className="mt-16">
      <h2
        id="content-index-heading"
        className="mb-6 text-xs font-semibold uppercase tracking-wider text-gray-500"
      >
        コンテンツ一覧
      </h2>

      <ul className="space-y-10">
        {index.map((theme) => {
          const colors = getThemeColorClasses(theme.color);

          return (
            <li key={theme.slug}>
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-white text-lg ${colors.border}`}
                  aria-hidden="true"
                >
                  {iconFallback(theme.icon)}
                </span>
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-gray-900">
                    {theme.isDraft ? (
                      theme.title
                    ) : (
                      <Link href={theme.href} className={`hover:underline ${colors.textStrong}`}>
                        {theme.title}
                      </Link>
                    )}
                  </h3>
                  {theme.isDraft ? <DraftBadge /> : null}
                </div>
                <span className="ml-auto shrink-0 text-xs text-gray-500">
                  {theme.moduleCount} モジュール / {theme.lessonCount} レッスン
                </span>
              </div>

              {theme.modules.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500">モジュールはまだありません。</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {theme.modules.map((mod) => (
                    <li key={mod.slug}>
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
                                    <Link
                                      href={lesson.href}
                                      className="text-sm text-gray-700 hover:underline"
                                    >
                                      {lesson.title}
                                    </Link>
                                    {lesson.isDraft ? <DraftBadge /> : null}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}

                          <p className="mt-3">
                            <Link
                              href={mod.href}
                              className={`text-xs font-medium hover:underline ${colors.text}`}
                            >
                              モジュールのページを見る →
                            </Link>
                          </p>
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
