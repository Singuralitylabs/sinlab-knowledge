import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonCard from "@/components/content/LessonCard";
import Prose from "@/components/content/Prose";
import DocLayout from "@/components/layout/DocLayout";
import Breadcrumb from "@/components/nav/Breadcrumb";
import LessonNav from "@/components/nav/LessonNav";
import TOC from "@/components/nav/TOC";
import { type DetailRef, renderMarkdown } from "@/lib/content/mdx";
import { getThemeColorClasses, iconFallback } from "@/lib/theme-color";
import {
  getAdjacentLessonsInModule,
  getDetail,
  getLesson,
  getModule,
  getTheme,
  getThemes,
} from "@/lib/themes";

interface PageProps {
  params: Promise<{ themeSlug: string; slug: string[] }>;
}

/**
 * Generate pages for:
 *   - Module top (`[themeSlug]/[moduleSlug]`)
 *   - Lecture (`[themeSlug]/[moduleSlug]/[lectureSlug]`)
 *   - Detail sub-page (`[themeSlug]/[moduleSlug]/[lectureSlug]/[detailSlug]`)
 */
export function generateStaticParams() {
  const params: { themeSlug: string; slug: string[] }[] = [];
  for (const theme of getThemes()) {
    for (const mod of theme.modules) {
      params.push({ themeSlug: theme.slug, slug: [mod.slug] });
      for (const lesson of mod.lessons) {
        params.push({ themeSlug: theme.slug, slug: [mod.slug, lesson.slug] });
        for (const detail of lesson.details) {
          params.push({ themeSlug: theme.slug, slug: [mod.slug, lesson.slug, detail.slug] });
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { themeSlug, slug } = await params;
  const theme = getTheme(themeSlug);
  if (!theme) return {};

  if (slug.length === 1) {
    const mod = getModule(themeSlug, slug[0]);
    if (!mod) return {};
    return {
      title: `${mod.meta.title} — ${theme.meta.title}`,
      description: mod.meta.description,
    };
  }

  if (slug.length === 2) {
    const lesson = getLesson(themeSlug, slug[0], slug[1]);
    if (!lesson) return {};
    return {
      title: lesson.frontmatter.title,
      description: lesson.frontmatter.description,
    };
  }

  if (slug.length === 3) {
    const detail = getDetail(themeSlug, slug[0], slug[1], slug[2]);
    if (!detail) return {};
    return {
      title: detail.frontmatter.title,
      description: detail.frontmatter.description,
    };
  }

  return {};
}

export default async function CatchAllPage({ params }: PageProps) {
  const { themeSlug, slug } = await params;
  const theme = getTheme(themeSlug);
  if (!theme) notFound();

  if (slug.length === 1) {
    return ModuleView({ themeSlug, moduleSlug: slug[0] });
  }

  if (slug.length === 2) {
    return LessonView({ themeSlug, moduleSlug: slug[0], lessonSlug: slug[1] });
  }

  if (slug.length === 3) {
    return DetailView({
      themeSlug,
      moduleSlug: slug[0],
      lessonSlug: slug[1],
      detailSlug: slug[2],
    });
  }

  notFound();
}

// ---------------------------------------------------------------------------
// Module top page
// ---------------------------------------------------------------------------

function ModuleView({ themeSlug, moduleSlug }: { themeSlug: string; moduleSlug: string }) {
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
          {iconFallback(mod.meta.icon)}
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

// ---------------------------------------------------------------------------
// Lecture body page (top-level lesson in a module)
// ---------------------------------------------------------------------------

async function LessonView({
  themeSlug,
  moduleSlug,
  lessonSlug,
}: {
  themeSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}) {
  const theme = getTheme(themeSlug);
  const mod = getModule(themeSlug, moduleSlug);
  const lesson = getLesson(themeSlug, moduleSlug, lessonSlug);
  if (!theme || !mod || !lesson) notFound();

  const colors = getThemeColorClasses(theme.meta.color);
  const detailMap = new Map<string, DetailRef>(
    lesson.details.map((detail) => [
      detail.slug,
      {
        slug: detail.slug,
        title: detail.frontmatter.title,
        description: detail.frontmatter.description,
        href: `/themes/${theme.slug}/${mod.slug}/${lesson.slug}/${detail.slug}`,
      },
    ]),
  );
  const { html, toc } = await renderMarkdown(lesson.body, {
    details: detailMap,
    directiveTheme: {
      border: colors.border,
      borderHover: colors.borderHover,
      bgSoft: colors.bgSoft,
      text: colors.text,
    },
  });
  const { prev, next } = getAdjacentLessonsInModule(lesson);

  const headerMeta = lesson.frontmatter;

  return (
    <DocLayout sidebar={<TOC items={toc} />}>
      <Breadcrumb
        items={[
          { label: "テーマ", href: "/themes" },
          { label: theme.meta.title, href: `/themes/${theme.slug}` },
          { label: mod.meta.title, href: `/themes/${theme.slug}/${mod.slug}` },
          { label: headerMeta.title },
        ]}
      />

      {headerMeta.status === "deprecated" ? (
        <div className="mt-6 rounded-md border border-orange-300 bg-orange-50 px-4 py-3 text-sm text-orange-900">
          このレッスンは <strong>非推奨</strong> です。内容が古い可能性があります。
        </div>
      ) : null}

      {headerMeta.description ? (
        <header className="mt-6 mb-8">
          <p className="text-sm text-gray-600">{headerMeta.description}</p>
        </header>
      ) : (
        <div className="mt-6" />
      )}

      <Prose html={html} />

      <LessonNav prev={prev} next={next} />
    </DocLayout>
  );
}

// ---------------------------------------------------------------------------
// Detail sub-page (under a directory-type lecture)
// ---------------------------------------------------------------------------

async function DetailView({
  themeSlug,
  moduleSlug,
  lessonSlug,
  detailSlug,
}: {
  themeSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  detailSlug: string;
}) {
  const theme = getTheme(themeSlug);
  const mod = getModule(themeSlug, moduleSlug);
  const lecture = getLesson(themeSlug, moduleSlug, lessonSlug);
  const detail = getDetail(themeSlug, moduleSlug, lessonSlug, detailSlug);
  if (!theme || !mod || !lecture || !detail) notFound();

  const { html, toc } = await renderMarkdown(detail.body);
  const { prev, next } = getAdjacentLessonsInModule(detail);

  const headerMeta = detail.frontmatter;

  return (
    <DocLayout sidebar={<TOC items={toc} />}>
      <Breadcrumb
        items={[
          { label: "テーマ", href: "/themes" },
          { label: theme.meta.title, href: `/themes/${theme.slug}` },
          { label: mod.meta.title, href: `/themes/${theme.slug}/${mod.slug}` },
          {
            label: lecture.frontmatter.title,
            href: `/themes/${theme.slug}/${mod.slug}/${lecture.slug}`,
          },
          { label: headerMeta.title },
        ]}
      />

      {headerMeta.status === "deprecated" ? (
        <div className="mt-6 rounded-md border border-orange-300 bg-orange-50 px-4 py-3 text-sm text-orange-900">
          このページは <strong>非推奨</strong> です。内容が古い可能性があります。
        </div>
      ) : null}

      {headerMeta.description ? (
        <header className="mt-6 mb-8">
          <p className="text-sm text-gray-600">{headerMeta.description}</p>
        </header>
      ) : (
        <div className="mt-6" />
      )}

      <Prose html={html} />

      <LessonNav prev={prev} next={next} />
    </DocLayout>
  );
}
