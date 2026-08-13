/**
 * Internal link validation.
 *
 * Cheaper and higher-value than the external link check: no network, fully
 * deterministic, and a broken `/themes/...` link is a 404 for a reader who is
 * already on the site. Unknown `::detail{slug=...}` targets already render as a
 * red error block, but ordinary `](/themes/...)` links were previously unchecked.
 */

import type { Theme } from "@/lib/content/loader";
import { collectAllLessonPaths, collectAllModulePaths } from "@/lib/themes";
import { maskCodeRegions } from "./mask";
import type { InternalLinkIssue } from "./types";

/** Routes that exist as pages but aren't derived from `content/`. */
const STATIC_ROUTES: readonly string[] = [
  "/",
  "/about",
  "/themes",
  "/login",
  "/pending",
  "/rejected",
];

/**
 * Prefixes served by a catch-all route handler whose valid values can't be
 * enumerated from the content tree.
 */
const UNCHECKABLE_PREFIXES: readonly string[] = ["/content-assets/"];

/**
 * Markdown link to a root-relative path: `](/themes/...)`, optionally carrying a
 * title — `](/themes/... "説明")`. Without the title branch, a broken link
 * written that way would never be reported.
 */
const MD_LINK_RE = /\]\((\/[^)\s]*)(?:[ \t]+["'][^"']*["'])?\)/g;

/** Raw HTML anchor to a root-relative path. */
const HTML_HREF_RE = /href=["'](\/[^"'\s]*)["']/g;

/** Strip the fragment, query string, and any trailing slash. */
export function normalizeInternalPath(href: string): string {
  const withoutFragment = href.split("#")[0].split("?")[0];
  if (withoutFragment === "/" || withoutFragment === "") return "/";
  return withoutFragment.replace(/\/+$/, "");
}

/**
 * Every root-relative path the site actually serves.
 *
 * `publicAssets` are the file names under `public/`, which Next.js serves at the
 * site root. They can't be derived from the content tree, and a reference to one
 * would otherwise be reported as broken — with no way to suppress it, since
 * internal link issues carry no fingerprint.
 */
export function buildValidInternalPaths(
  themes: Theme[],
  publicAssets: readonly string[] = [],
): Set<string> {
  const paths = new Set<string>(STATIC_ROUTES);

  for (const asset of publicAssets) {
    paths.add(asset.startsWith("/") ? asset : `/${asset}`);
  }

  for (const theme of themes) {
    paths.add(`/themes/${theme.slug}`);
  }
  for (const { themeSlug, slug } of collectAllModulePaths(themes)) {
    paths.add(`/themes/${themeSlug}/${slug.join("/")}`);
  }
  for (const { themeSlug, slug } of collectAllLessonPaths(themes)) {
    paths.add(`/themes/${themeSlug}/${slug.join("/")}`);
  }

  return paths;
}

export interface InternalLinkRef {
  href: string;
  line: number;
  context: string;
}

/** Root-relative links in prose. Code fences are masked out first. */
export function extractInternalLinks(rawSource: string): InternalLinkRef[] {
  const refs: InternalLinkRef[] = [];
  const lines = maskCodeRegions(rawSource).split("\n");

  for (const [index, text] of lines.entries()) {
    for (const pattern of [MD_LINK_RE, HTML_HREF_RE]) {
      const re = new RegExp(pattern.source, "g");
      let match: RegExpExecArray | null = re.exec(text);
      while (match !== null) {
        refs.push({ href: match[1], line: index + 1, context: text.trim() });
        match = re.exec(text);
      }
    }
  }

  return refs;
}

/** Links that don't resolve to a real page. */
export function findInternalLinkIssues(
  file: string,
  rawSource: string,
  validPaths: ReadonlySet<string>,
): InternalLinkIssue[] {
  const issues: InternalLinkIssue[] = [];

  for (const { href, line, context } of extractInternalLinks(rawSource)) {
    if (UNCHECKABLE_PREFIXES.some((prefix) => href.startsWith(prefix))) continue;
    const normalized = normalizeInternalPath(href);
    if (!validPaths.has(normalized)) {
      issues.push({ file, line, href, context });
    }
  }

  return issues;
}
