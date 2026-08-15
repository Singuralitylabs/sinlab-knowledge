import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import LessonCard from "@/components/content/LessonCard";
import Breadcrumb from "@/components/nav/Breadcrumb";
import { getThemeColorClasses, iconFallback } from "@/lib/theme-color";
import { getModule, getTheme, getThemes } from "@/lib/themes";

interface ModulePageProps {
  params: Promise<{ themeSlug: string; moduleSlug: string }>;
}

export function generateStaticParams() {
  const params: { themeSlug: string; moduleSlug: string }[] = [];
  for (const theme of getThemes()) {
    for (const mod of theme.modules) {
      params.push({ themeSlug: theme.slug, moduleSlug: mod.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const { themeSlug, moduleSlug } = await params;
  const theme = getTheme(themeSlug);
  if (!theme) return {};
  const mod = getModule(themeSlug, moduleSlug);
  if (!mod) return {};
  return {
    title: `${mod.meta.title} — ${theme.meta.title}`,
    description: mod.meta.description,
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { themeSlug, moduleSlug } = await params;
  const theme = getTheme(themeSlug);
  const mod = getModule(themeSlug, moduleSlug);
  if (!theme || !mod) notFound();

  const colors = getThemeColorClasses(theme.meta.color);
  const categoryLabelByKey = new Map(
    (mod.meta.categories ?? []).map((c) => [c.key, c.label] as const),
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <Breadcrumb
        items={[
          { label: "テーマ", href: "/themes" },
          { label: theme.meta.title, href: `/themes/${theme.slug}` },
          { label: mod.meta.title },
        ]}
      />

      <header className="mt-6 mb-10 flex items-start gap-5">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${colors.bgSoft} ${colors.border} border`}
          aria-hidden="true"
        >
          {mod.meta.iconImage ? (
            <Image
              src={mod.meta.iconImage}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              unoptimized
            />
          ) : (
            iconFallback(mod.meta.icon)
          )}
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{mod.meta.title}</h1>
          <p className="mt-1 text-sm text-gray-600">{mod.meta.description}</p>
          <p className="mt-1 text-xs text-gray-500">{mod.lessons.length} 解説</p>
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">解説</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mod.lessons.map((lesson) => (
            <li key={lesson.slug}>
              <LessonCard
                lesson={lesson}
                themeColor={theme.meta.color}
                categoryLabel={
                  lesson.frontmatter.category
                    ? categoryLabelByKey.get(lesson.frontmatter.category)
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
