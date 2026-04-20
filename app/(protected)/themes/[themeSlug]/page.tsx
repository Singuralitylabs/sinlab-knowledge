import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/nav/Breadcrumb";
import ModuleCard from "@/components/theme/ModuleCard";
import { getThemeColorClasses, iconFallback } from "@/lib/theme-color";
import { getTheme, getThemes } from "@/lib/themes";

interface ThemePageProps {
  params: Promise<{ themeSlug: string }>;
}

export function generateStaticParams() {
  return getThemes().map((theme) => ({ themeSlug: theme.slug }));
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { themeSlug } = await params;
  const theme = getTheme(themeSlug);
  if (!theme) return {};
  return {
    title: theme.meta.title,
    description: theme.meta.description,
  };
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { themeSlug } = await params;
  const theme = getTheme(themeSlug);
  if (!theme) notFound();

  const colors = getThemeColorClasses(theme.meta.color);
  const lessonCount = theme.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <Breadcrumb items={[{ label: "テーマ", href: "/themes" }, { label: theme.meta.title }]} />

      <header className="mt-6 mb-10 flex items-start gap-5">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${colors.bgSoft} ${colors.border} border`}
          aria-hidden="true"
        >
          {iconFallback(theme.meta.icon)}
        </span>
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{theme.meta.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{theme.meta.description}</p>
          <p className="mt-2 text-xs text-gray-500">
            {theme.modules.length} モジュール / {lessonCount} レッスン
          </p>
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
          モジュール
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {theme.modules.map((mod) => (
            <li key={mod.slug}>
              <ModuleCard module={mod} themeColor={theme.meta.color} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
