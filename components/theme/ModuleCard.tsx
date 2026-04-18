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
      className={`group flex flex-col gap-2 rounded-lg border bg-gray-900/40 p-5 transition ${colors.border} ${colors.borderHover} hover:bg-gray-900/70`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-md text-base ${colors.bgSoft}`}
          aria-hidden="true"
        >
          {iconFallback(module.meta.icon)}
        </span>
        <h3 className="text-base font-semibold text-gray-100 group-hover:text-white">
          {module.meta.title}
        </h3>
      </div>
      <p className="text-sm text-gray-400">{module.meta.description}</p>
      <p className="mt-1 text-xs text-gray-500">{lessonCount} レッスン</p>
    </Link>
  );
}
