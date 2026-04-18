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

  return (
    <Link
      href={`/themes/${theme.slug}`}
      className={`group flex flex-col gap-3 rounded-xl border bg-gray-900/40 p-6 transition ${colors.border} ${colors.borderHover} hover:bg-gray-900/70`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${colors.bgSoft}`}
          aria-hidden="true"
        >
          {iconFallback(theme.meta.icon)}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-gray-100 group-hover:text-white">
            {theme.meta.title}
          </h2>
          <p className={`text-xs font-medium ${colors.text}`}>
            {DIFFICULTY_LABELS[theme.meta.difficulty] ?? theme.meta.difficulty}
          </p>
        </div>
      </div>

      <p className="line-clamp-3 text-sm text-gray-400">{theme.meta.description}</p>

      <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-gray-500">
        <span>
          {moduleCount} モジュール / {lessonCount} レッスン
        </span>
        {theme.meta.estimatedHours ? <span>約 {theme.meta.estimatedHours} 時間</span> : null}
      </div>
    </Link>
  );
}
