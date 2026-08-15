import ModuleLessonList from "@/components/content/ModuleLessonList";
import { buildContentIndex } from "@/lib/content-index";
import { getThemeColorClasses } from "@/lib/theme-color";
import type { Theme } from "@/lib/themes";

export interface ThemeLessonIndexProps {
  theme: Theme;
}

/**
 * Per-theme lesson listing shown under the module cards on a theme page.
 *
 * Unlike {@link ContentIndex} this is always expanded: a single theme holds at
 * most a few dozen lectures, and a reader who already picked a theme should see
 * its lesson titles without clicking. The theme heading is omitted because the
 * page already carries it as `<h1>`.
 */
export default function ThemeLessonIndex({ theme }: ThemeLessonIndexProps) {
  // buildContentIndex maps 1:1 over the themes it is given, so a single-element
  // input always yields a single-element projection.
  const [entry] = buildContentIndex([theme]);
  const colors = getThemeColorClasses(theme.meta.color);

  return (
    <section aria-labelledby="theme-lesson-index-heading" className="mt-12">
      <h2
        id="theme-lesson-index-heading"
        className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
      >
        レッスン一覧
      </h2>

      <ModuleLessonList modules={entry.modules} colors={colors} collapsible={false} />
    </section>
  );
}
