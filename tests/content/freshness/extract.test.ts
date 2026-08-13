import { describe, expect, test } from "bun:test";
import {
  extractClaims,
  extractDateClaims,
  extractUrls,
  extractVersionClaims,
  isCheckableUrl,
} from "@/lib/content/freshness/extract";
import { maskCodeRegions, paragraphRanges } from "@/lib/content/freshness/mask";

const NOW = new Date("2026-08-10T00:00:00Z");

describe("maskCodeRegions", () => {
  test("preserves the line count so claim line numbers match the raw file", () => {
    const source = ["intro", "```sh", "chmod 644 file", "```", "outro"].join("\n");
    expect(maskCodeRegions(source).split("\n")).toHaveLength(source.split("\n").length);
  });

  test("blanks fenced code but keeps surrounding prose", () => {
    const masked = maskCodeRegions(
      ["前文 https://keep.example.org/a", "```", "https://drop.test/b", "```", "後文"].join("\n"),
    );
    expect(masked).toContain("https://keep.example.org/a");
    expect(masked).not.toContain("https://drop.test/b");
  });

  test("handles tilde fences", () => {
    const masked = maskCodeRegions(["~~~", "https://drop.test/b", "~~~"].join("\n"));
    expect(masked).not.toContain("drop.test");
  });

  test("a shorter inner fence does not close a longer outer fence", () => {
    // The Markdown lessons wrap ``` blocks in ```` blocks to demonstrate fence syntax.
    const masked = maskCodeRegions(
      ["````", "```sh", "https://inner.test/x", "```", "````", "https://outer.test/y"].join("\n"),
    );
    expect(masked).not.toContain("inner.test");
    expect(masked).toContain("outer.test");
  });

  test("an unclosed fence masks through end of file", () => {
    const masked = maskCodeRegions(["```", "https://drop.test/b", "still code"].join("\n"));
    expect(masked).not.toContain("drop.test");
  });

  test("removes inline code spans", () => {
    expect(maskCodeRegions("設定は `chmod 644` のように書く")).not.toContain("chmod 644");
  });
});

describe("paragraphRanges", () => {
  test("splits on blank lines with 1-indexed inclusive ranges", () => {
    expect(paragraphRanges("a\nb\n\nc")).toEqual([
      { start: 1, end: 2 },
      { start: 4, end: 4 },
    ]);
  });
});

describe("extractUrls", () => {
  test("finds markdown, bare, and autolink URLs with correct line numbers", () => {
    const claims = extractUrls(
      ["[docs](https://code.claude.com/docs)", "", "https://git-scm.com/doc"].join("\n"),
    );
    expect(claims.map((c) => [c.value, c.line])).toEqual([
      ["https://code.claude.com/docs", 1],
      ["https://git-scm.com/doc", 3],
    ]);
  });

  test("trims trailing prose punctuation, including Japanese", () => {
    const claims = extractUrls("詳細は https://nodejs.org/api 。次に");
    expect(claims[0].value).toBe("https://nodejs.org/api");
  });

  test("flags benchmark and leaderboard hosts, whose numbers go stale while the link lives", () => {
    const [claim] = extractUrls("[AA](https://artificialanalysis.ai/)");
    expect(claim.note).toContain("統計・ベンチマーク系");
  });

  test("excludes placeholder and example URLs", () => {
    const claims = extractUrls(
      [
        "https://example.com/a",
        "https://api.example.com/b",
        "https://via.placeholder.com/150",
        "https://img.shields.io/badge",
        "https://github.com/your-name/repo",
        "http://localhost:3000",
      ].join("\n"),
    );
    expect(claims).toHaveLength(0);
  });

  test("excludes our own site, which internal link checking already covers", () => {
    expect(isCheckableUrl("https://sinlab.future-tech-association.org/themes")).toBe(false);
  });

  test("keeps real third-party links", () => {
    expect(isCheckableUrl("https://github.com/anthropics/claude-code")).toBe(true);
  });
});

describe("extractVersionClaims", () => {
  const values = (source: string, confidence?: "high" | "low"): string[] =>
    extractVersionClaims(source)
      .filter((c) => confidence === undefined || c.confidence === confidence)
      .map((c) => c.value);

  test("detects known products, including versions with no patch number", () => {
    expect(values("Node.js 18 と Next.js 16 が必要", "high")).toEqual(["Node.js 18", "Next.js 16"]);
    expect(values("Git 2.23 で導入", "high")).toEqual(["Git 2.23"]);
    expect(values("Python 3.13 に対応", "high")).toEqual(["Python 3.13"]);
  });

  test("detects AI model versions, the fastest-staling claims in this repository", () => {
    expect(values("Opus 4.7 と Sonnet 4.6 と Gemini 1.5", "high")).toEqual([
      "Opus 4.7",
      "Sonnet 4.6",
      "Gemini 1.5",
    ]);
  });

  // Regression cases observed while measuring the real corpus. Each of these
  // matched a naive version regex and must never come back.
  test("does not report shell output or numeric prose as versions", () => {
    for (const noise of [
      "chmod 644 settings.json",
      "delta 0 files changed",
      "-rw-r--r-- 1 user staff",
      "exit 0 で終了",
      "Top 10 の項目",
      "Level 1 から始める",
      "Step 3 に進む",
      "Hue 0 は赤",
      "第3章 を参照",
      "インデントは 2 スペース",
    ]) {
      expect(values(noise)).toEqual([]);
    }
  });

  test("suppresses benchmark scores that look like dotted versions", () => {
    expect(values("CVSS 7.1 と MMLU 92.5 のスコア")).toEqual([]);
  });

  test("reports a product outside the dictionary with a dotted version as low confidence", () => {
    expect(values("Fastify 4.26.0 を使う", "low")).toEqual(["Fastify 4.26.0"]);
    // A dictionary product is high confidence instead, not duplicated into low.
    expect(values("Express 4.18.2 を使う", "high")).toEqual(["Express 4.18.2"]);
    expect(values("Express 4.18.2 を使う", "low")).toEqual([]);
  });
});

describe("extractDateClaims", () => {
  const values = (source: string, confidence?: "high" | "low"): string[] =>
    extractDateClaims(source, NOW)
      .filter((c) => confidence === undefined || c.confidence === confidence)
      .map((c) => c.value);

  test("matches year-month with and without spaces", () => {
    // Both spellings occur in the corpus.
    expect(values("2026 年 6 月 時点", "high")).toContain("2026 年 6 月");
    expect(values("2021年8月に登場", "high")).toContain("2021年8月");
  });

  test("matches ISO dates", () => {
    expect(values("2026-03-15 にリリース", "high")).toContain("2026-03-15");
  });

  test("matches explicit point-in-time phrases", () => {
    expect(values("執筆時点の仕様です", "high")).toContain("執筆時点");
  });

  test("marks recent years as likely time-dependent and old years as likely historical", () => {
    const recent = extractDateClaims("2026 年 6 月の仕様", NOW).find((c) => c.kind === "date");
    const old = extractDateClaims("2004年に誕生した", NOW).find((c) => c.kind === "date");
    expect(recent?.note).toContain("直近の年号");
    expect(old?.note).toContain("古い年号");
  });

  test("ignores bare 現在 with no anchor in its paragraph", () => {
    // 現在 appears ~101 times across 71 files, usually meaning "is in the state of".
    expect(values("現在の状態を確認してください")).toEqual([]);
  });

  test("reports bare 現在 as low confidence when its paragraph carries a year", () => {
    expect(values("2026 年 6 月にリリース\n現在も利用できます", "low")).toContain("現在");
  });
});

describe("extractClaims", () => {
  test("masks code before extracting, and sorts by line", () => {
    const source = [
      "---",
      "title: テスト",
      "---",
      "",
      "本文 https://code.claude.com/docs で Node.js 18 が必要。",
      "",
      "```sh",
      "curl https://drop.test/x",
      "chmod 644 file",
      "```",
    ].join("\n");

    const claims = extractClaims(source, NOW);
    expect(claims.map((c) => c.value)).toEqual(["https://code.claude.com/docs", "Node.js 18"]);
    // Line 5 of the raw file, frontmatter included.
    expect(claims.every((c) => c.line === 5)).toBe(true);
  });
});
