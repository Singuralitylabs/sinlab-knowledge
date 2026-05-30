import { describe, expect, test } from "bun:test";
import type { DetailRef } from "@/lib/content/mdx";
import { renderMarkdown } from "@/lib/content/mdx";

describe("renderMarkdown — table of contents", () => {
  test("dedups duplicate heading ids so TOC and headings stay in sync", async () => {
    const { html, toc } = await renderMarkdown("## 表示結果\n\nfoo\n\n## 表示結果\n");
    expect(toc.map((t) => t.id)).toEqual(["表示結果", "表示結果-1"]);
    expect(html).toContain('id="表示結果"');
    expect(html).toContain('id="表示結果-1"');
  });

  test("collects only H2/H3 with their depth", async () => {
    const { toc } = await renderMarkdown("# H1\n\n## H2\n\n### H3\n\n#### H4\n");
    expect(toc).toEqual([
      { id: "h2", text: "H2", depth: 2 },
      { id: "h3", text: "H3", depth: 3 },
    ]);
  });
});

describe("renderMarkdown — external links", () => {
  test("opens external links in a new tab and leaves relative links same-tab", async () => {
    const { html } = await renderMarkdown("[ext](https://example.com) と [rel](/themes/x)");
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    // Only the external anchor gets a target; the relative one stays untouched.
    expect((html.match(/target="_blank"/g) ?? []).length).toBe(1);
    expect(html).toContain('href="/themes/x"');
  });
});

describe("renderMarkdown — ::detail directive", () => {
  const detail: DetailRef = {
    slug: "intro",
    title: "イントロ",
    description: "概要説明",
    href: "/themes/a/m/lecture/intro",
  };

  test("renders a card link for a known detail slug", async () => {
    const details = new Map<string, DetailRef>([[detail.slug, detail]]);
    const { html } = await renderMarkdown('::detail{slug="intro"}', { details });
    expect(html).toContain('href="/themes/a/m/lecture/intro"');
    expect(html).toContain("イントロ →");
    expect(html).toContain("概要説明");
  });

  test("renders a visible error for an unknown detail slug", async () => {
    const { html } = await renderMarkdown('::detail{slug="missing"}', {
      details: new Map(),
    });
    expect(html).toContain('詳細サブページ "missing" が見つかりません');
  });
});
