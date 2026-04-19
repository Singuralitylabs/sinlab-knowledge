import Link from "next/link";
import { getThemeColorClasses, iconFallback } from "@/lib/theme-color";
import type { ContentModule } from "@/lib/themes";

export interface ModuleCardProps {
  module: ContentModule;
  /** Theme color token for accent. */
  themeColor: string;
}

export default function ModuleCard({ module, themeColor }: ModuleCardProps) {
  const colors = getThemeColorClasses(themeColor);
  const lessonCount = module.lessons.length;

  return (
    <Link
      href={`/themes/${module.themeSlug}/${module.slug}`}
      className={`group flex h-full flex-col gap-2 rounded-lg border p-5 shadow-sm transition ${colors.bgSoft} ${colors.bgSoftHover} ${colors.border} ${colors.borderHover}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-md border bg-white text-base ${colors.border}`}
          aria-hidden="true"
        >
          {iconFallback(module.meta.icon)}
        </span>
        <h3 className="text-base font-semibold text-gray-900">{module.meta.title}</h3>
      </div>
      <p className="text-sm text-gray-600">{module.meta.description}</p>
      <p className="mt-1 text-xs text-gray-500">{lessonCount} レッスン</p>
    </Link>
  );
}
