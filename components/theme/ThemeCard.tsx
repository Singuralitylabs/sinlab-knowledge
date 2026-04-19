import Link from "next/link";
import { getThemeColorClasses, iconFallback } from "@/lib/theme-color";
import type { Theme } from "@/lib/themes";

export interface ThemeCardProps {
  theme: Theme;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

export default function ThemeCard({ theme }: ThemeCardProps) {
  const colors = getThemeColorClasses(theme.meta.color);
  const lessonCount = theme.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const moduleCount = theme.modules.length;
  const isDraft = theme.meta.status === "draft";

  const baseClass = `group flex h-full flex-col gap-3 rounded-xl border p-6 shadow-sm ${colors.bgSoft} ${colors.border}`;
  const interactiveClass = `transition ${colors.bgSoftHover} ${colors.borderHover}`;
  const draftClass = "cursor-not-allowed opacity-75";

  const body = (
    <>
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-xl ${colors.border}`}
          aria-hidden="true"
        >
          {iconFallback(theme.meta.icon)}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">{theme.meta.title}</h2>
            {isDraft ? (
              <span className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">
                執筆予定
              </span>
            ) : null}
          </div>
          <p className={`text-xs font-medium ${colors.text}`}>
            {DIFFICULTY_LABELS[theme.meta.difficulty] ?? theme.meta.difficulty}
          </p>
        </div>
      </div>

      <p className="line-clamp-3 text-sm text-gray-600">
        {isDraft ? `（執筆予定）${theme.meta.description}` : theme.meta.description}
      </p>

      <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-gray-500">
        <span>
          {moduleCount} モジュール / {lessonCount} レッスン
        </span>
      </div>
    </>
  );

  if (isDraft) {
    return (
      <div className={`${baseClass} ${draftClass}`} aria-disabled="true">
        {body}
      </div>
    );
  }

  return (
    <Link href={`/themes/${theme.slug}`} className={`${baseClass} ${interactiveClass}`}>
      {body}
    </Link>
  );
}
