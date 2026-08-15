import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Prose from "@/components/content/Prose";
import DocLayout from "@/components/layout/DocLayout";
import Breadcrumb from "@/components/nav/Breadcrumb";
import LessonNav from "@/components/nav/LessonNav";
import TOC from "@/components/nav/TOC";
import { type DetailRef, renderMarkdown } from "@/lib/content/mdx";
import { getThemeColorClasses } from "@/lib/theme-color";
import {
  getAdjacentLessonsInModule,
  getDetail,
  getLesson,
  getModule,
  getTheme,
  getThemes,
} from "@/lib/themes";

interface PageProps {
  params: Promise<{ themeSlug: string; moduleSlug: string; slug: string[] }>;
}

/**
 * Generate pages for:
 *   - Lecture (`[themeSlug]/[moduleSlug]/[lectureSlug]`)
 *   - Detail sub-page (`[themeSlug]/[moduleSlug]/[lectureSlug]/[detailSlug]`)
 */
export function generateStaticParams() {
  const params: { themeSlug: string; moduleSlug: string; slug: string[] }[] = [];
  for (const theme of getThemes()) {
    for (const mod of theme.modules) {
      for (const lesson of mod.lessons) {
        params.push({ themeSlug: theme.slug, moduleSlug: mod.slug, slug: [lesson.slug] });
        for (const detail of lesson.details) {
          params.push({
            themeSlug: theme.slug,
            moduleSlug: mod.slug,
            slug: [lesson.slug, detail.slug],
          });
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { themeSlug, moduleSlug, slug } = await params;
  const theme = getTheme(themeSlug);
  if (!theme) return {};

  if (slug.length === 1) {
    const lesson = getLesson(themeSlug, moduleSlug, slug[0]);
    if (!lesson) return {};
    return {
      title: lesson.frontmatter.title,
      description: lesson.frontmatter.description,
    };
  }

  if (slug.length === 2) {
    const detail = getDetail(themeSlug, moduleSlug, slug[0], slug[1]);
    if (!detail) return {};
    return {
      title: detail.frontmatter.title,
      description: detail.frontmatter.description,
    };
  }

  return {};
}

export default async function CatchAllPage({ params }: PageProps) {
  const { themeSlug, moduleSlug, slug } = await params;
  const theme = getTheme(themeSlug);
  if (!theme) notFound();

  if (slug.length === 1) {
    return LessonView({ themeSlug, moduleSlug, lessonSlug: slug[0] });
  }

  if (slug.length === 2) {
    return DetailView({ themeSlug, moduleSlug, lessonSlug: slug[0], detailSlug: slug[1] });
  }

  notFound();
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
