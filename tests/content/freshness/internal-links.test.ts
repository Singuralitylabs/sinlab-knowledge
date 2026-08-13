import { describe, expect, test } from "bun:test";
import {
  buildValidInternalPaths,
  extractInternalLinks,
  findInternalLinkIssues,
  normalizeInternalPath,
} from "@/lib/content/freshness/internal-links";
import { makeLesson, makeModule, makeTheme } from "../../helpers/fixtures";

describe("normalizeInternalPath", () => {
  test("drops fragments, query strings, and trailing slashes", () => {
    expect(normalizeInternalPath("/themes/01-a/02-b/lesson#section")).toBe(
      "/themes/01-a/02-b/lesson",
    );
    expect(normalizeInternalPath("/themes/01-a?x=1")).toBe("/themes/01-a");
    expect(normalizeInternalPath("/themes/01-a/")).toBe("/themes/01-a");
  });

  test("keeps the site root intact", () => {
    expect(normalizeInternalPath("/")).toBe("/");
  });
});

describe("buildValidInternalPaths", () => {
  const lesson = makeLesson("what-is-git", { themeSlug: "01-web-basics", moduleSlug: "02-git" });
  const mod = makeModule("02-git", [lesson]);
  const theme = makeTheme("01-web-basics", [mod]);

  test("includes theme, module, and lesson routes derived from the content tree", () => {
    const paths = buildValidInternalPaths([theme]);
    expect(paths.has("/themes/01-web-basics")).toBe(true);
    expect(paths.has("/themes/01-web-basics/02-git")).toBe(true);
    expect(paths.has("/themes/01-web-basics/02-git/what-is-git")).toBe(true);
  });

  test("includes static routes that aren't derived from content", () => {
    const paths = buildValidInternalPaths([theme]);
    expect(paths.has("/")).toBe(true);
    expect(paths.has("/about")).toBe(true);
    expect(paths.has("/themes")).toBe(true);
  });

  // public/ files are served at the site root and can't be derived from content/.
  // Internal link issues carry no fingerprint, so a false positive here is
  // unsuppressible.
  test("accepts public/ assets, with or without a leading slash", () => {
    const paths = buildValidInternalPaths([theme], ["icon.png", "/og-image.png"]);
    expect(paths.has("/icon.png")).toBe(true);
    expect(paths.has("/og-image.png")).toBe(true);
  });

  test("treats the asset list as optional", () => {
    expect(buildValidInternalPaths([theme]).has("/icon.png")).toBe(false);
  });
});

describe("extractInternalLinks", () => {
  test("finds markdown links and raw HTML hrefs with line numbers", () => {
    const refs = extractInternalLinks(
      ["[設定](/themes/01-a/02-b/settings)", "", '<a href="/about">about</a>'].join("\n"),
    );
    expect(refs.map((r) => [r.href, r.line])).toEqual([
      ["/themes/01-a/02-b/settings", 1],
      ["/about", 3],
    ]);
  });

  test("ignores links inside code fences", () => {
    const refs = extractInternalLinks(["```md", "[x](/themes/fake)", "```"].join("\n"));
    expect(refs).toHaveLength(0);
  });

  test("ignores external URLs", () => {
    expect(extractInternalLinks("[docs](https://code.claude.com/docs)")).toHaveLength(0);
  });

  // Without the title branch, a broken link written this way is never reported.
  test("finds links carrying a title", () => {
    expect(extractInternalLinks('[設定](/themes/01-a/02-b/settings "設定の編集方法")')).toEqual([
      {
        href: "/themes/01-a/02-b/settings",
        line: 1,
        context: '[設定](/themes/01-a/02-b/settings "設定の編集方法")',
      },
    ]);
    expect(extractInternalLinks("[x](/about 'タイトル')").map((r) => r.href)).toEqual(["/about"]);
  });
});

describe("findInternalLinkIssues", () => {
  const valid = new Set(["/themes/01-web-basics/03-vscode/intro-settings/settings", "/about"]);

  test("reports a link that resolves to no page", () => {
    // The real defect this check found: theme and module directories keep their
    // NN- prefix in URLs; only lesson slugs have it stripped.
    const issues = findInternalLinkIssues(
      "content/a.md",
      "[設定](/themes/web-basics/vscode/intro-settings/settings) を参照",
      valid,
    );
    expect(issues).toHaveLength(1);
    expect(issues[0].href).toBe("/themes/web-basics/vscode/intro-settings/settings");
    expect(issues[0].line).toBe(1);
  });

  test("accepts a link that resolves", () => {
    const issues = findInternalLinkIssues(
      "content/a.md",
      "[設定](/themes/01-web-basics/03-vscode/intro-settings/settings)",
      valid,
    );
    expect(issues).toHaveLength(0);
  });

  test("accepts a resolving link carrying a fragment", () => {
    const issues = findInternalLinkIssues(
      "content/a.md",
      "[設定](/themes/01-web-basics/03-vscode/intro-settings/settings#syntax)",
      valid,
    );
    expect(issues).toHaveLength(0);
  });

  test("skips catch-all asset routes it cannot enumerate", () => {
    const issues = findInternalLinkIssues(
      "content/a.md",
      "![図](/content-assets/01-web-basics/diagram.png)",
      valid,
    );
    expect(issues).toHaveLength(0);
  });
});
