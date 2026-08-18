import Link from "next/link";
import DraftBadge from "@/components/content/DraftBadge";
import ModuleLessonList from "@/components/content/ModuleLessonList";
import { buildContentIndex } from "@/lib/content-index";
import { getThemeColorClasses, iconFallback } from "@/lib/theme-color";
import type { Theme } from "@/lib/themes";

export interface ContentIndexProps {
  themes: Theme[];
}

/**
 * Site-wide content index: テーマ → モジュール（折りたたみ）→ レッスン。
 * Used on the home page and on `/themes`, where every theme is listed at once.
 *
 * Server Component by design — the collapsing is native `<details>`/`<summary>`,
 * so the pages stay statically rendered with no client JS.
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
              <div className="mb-3 flex items-center gap-3 border-b border-gray-200 pb-3">
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

              <ModuleLessonList modules={theme.modules} colors={colors} collapsible />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
