import { describe, expect, test } from "bun:test";
import {
  extractClaims,
  extractDateClaims,
  extractUrls,
  extractVersionClaims,
  isCheckableUrl,
  isDisplayedImageUrl,
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

  // CommonMark: a closing fence carries no info string. The Markdown lessons
  // demonstrate fence syntax by nesting fences, so getting this wrong breaks
  // both ways — code leaks out, and real prose after it gets masked away.
  test("a fence with an info string does not close an open block", () => {
    const masked = maskCodeRegions(
      [
        "```markdown",
        "```javascript",
        "https://leak.test/x",
        "```",
        "",
        "## 本文の見出し https://keep.test/y",
      ].join("\n"),
    );
    expect(masked).not.toContain("leak.test");
    expect(masked).toContain("keep.test");
    expect(masked).toContain("## 本文の見出し");
  });

  test("a bare fence of equal length still closes", () => {
    const masked = maskCodeRegions(["```", "https://drop.test/a", "```", "本文"].join("\n"));
    expect(masked).not.toContain("drop.test");
    expect(masked).toContain("本文");
  });

  test("trailing whitespace does not stop a fence from closing", () => {
    const masked = maskCodeRegions(["```", "https://drop.test/a", "```   ", "本文"].join("\n"));
    expect(masked).toContain("本文");
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
        "https://img.shields.io/badge",
        "https://github.com/your-name/repo",
        "http://localhost:3000",
      ].join("\n"),
    );
    expect(claims).toHaveLength(0);
  });

  test("still excludes placeholder image hosts when they are not rendered images", () => {
    expect(extractUrls("参考: https://via.placeholder.com/150")).toHaveLength(0);
    expect(extractUrls("参考: https://placehold.co/200x150")).toHaveLength(0);
    expect(isCheckableUrl("https://via.placeholder.com/150")).toBe(false);
  });

  // Inline images actually render for the reader, so a dead placeholder CDN
  // is user-visible damage — unlike a URL mentioned in prose or a code fence.
  test("extracts placeholder image CDNs when they are markdown or HTML images", () => {
    expect(extractUrls("![x](https://placehold.co/200x150)").map((c) => c.value)).toEqual([
      "https://placehold.co/200x150",
    ]);
    expect(extractUrls("![x](https://via.placeholder.com/150)").map((c) => c.value)).toEqual([
      "https://via.placeholder.com/150",
    ]);
    expect(
      extractUrls('<img src="https://placehold.co/200x100" alt="x">').map((c) => c.value),
    ).toEqual(["https://placehold.co/200x100"]);
  });

  test("does not treat a placeholder URL as an image just because another img is on the line", () => {
    const line = 'https://via.placeholder.com/150 <img src="/real.png" alt="x">';
    expect(extractUrls(line)).toHaveLength(0);
    expect(isDisplayedImageUrl(line, "https://via.placeholder.com/150")).toBe(false);
    expect(isDisplayedImageUrl('<img src="/real.png">', "https://via.placeholder.com/150")).toBe(
      false,
    );
  });

  // Regression: `\byour[-_]?` matched any word starting with "your", so the
  // real Anthropic help-center URL .../set-up-your-design-system-... was
  // silently excluded from stage 2. The pattern must require the placeholder
  // shape itself, not just the word "your".
  test("does not exclude a real URL that merely contains the word your", () => {
    const url =
      "https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design";
    expect(isCheckableUrl(url)).toBe(true);
    expect(extractUrls(`[link](${url})`)).toHaveLength(1);
  });

  test("still excludes genuine your-* placeholders", () => {
    expect(isCheckableUrl("https://github.com/your-name/repo")).toBe(false);
    expect(isCheckableUrl("https://github.com/yourname/repo")).toBe(false);
    expect(isCheckableUrl("https://github.com/your-org/repo")).toBe(false);
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

  // A multi-word product name must not also yield its tail as a separate claim.
  test("does not emit a trailing-word duplicate for multi-word product names", () => {
    expect(values("Tailwind CSS 3.4 を使う")).toEqual(["Tailwind CSS 3.4"]);
    expect(values("VS Code 1.96 で確認")).toEqual(["VS Code 1.96"]);
    expect(values("Visual Studio Code 1.96")).toEqual(["Visual Studio Code 1.96"]);
    expect(values("Claude Code 2.1 の挙動")).toEqual(["Claude Code 2.1"]);
  });

  test("still reports an unrelated product elsewhere on the same line", () => {
    expect(values("VS Code 1.96 と Fastify 4.26.0", "high")).toEqual(["VS Code 1.96"]);
    expect(values("VS Code 1.96 と Fastify 4.26.0", "low")).toEqual(["Fastify 4.26.0"]);
  });

  test("reports a product outside the dictionary with a dotted version as low confidence", () => {
    expect(values("Fastify 4.26.0 を使う", "low")).toEqual(["Fastify 4.26.0"]);
    // A dictionary product is high confidence instead, not duplicated into low.
    expect(values("Express 4.18.2 を使う", "high")).toEqual(["Express 4.18.2"]);
    expect(values("Express 4.18.2 を使う", "low")).toEqual([]);
  });

  // #48 and #63 both reported the same three floor-notation lines as staleness
  // candidates. 「Git 2.23 以降で使えます」 stays true forever, so it must not reach
  // the default (high-confidence-only) report.
  test("drops an availability floor to low confidence", () => {
    for (const [source, value] of [
      ["Claude Code v2.1.225 以降で利用できます", "Claude Code v2.1.225"],
      ["VS Code 1.96+ のインライン blame", "VS Code 1.96"],
      ["Git 2.23 以降で使えます", "Git 2.23"],
      ["Git 2.23以降で使えます", "Git 2.23"],
      ["Python 3.13 以後に対応", "Python 3.13"],
      ["Git\u30002.23\u3000以降", "Git\u30002.23"],
    ] as const) {
      expect(values(source, "high")).toEqual([]);
      expect(values(source, "low")).toEqual([value]);
    }
  });

  // 「以上」 states a *requirement*, not availability: 「Node.js 18 以上」 becomes
  // wrong the moment the minimum is raised to 20. Demoting it would drop a real
  // compatibility regression out of the default report.
  test("keeps a minimum-requirement floor at high confidence", () => {
    for (const source of [
      "Node.js 18 以上 (LTS 推奨)",
      "Node.js 18以上が必要です",
      "Node.js 18 以上の環境で実行してください",
    ]) {
      expect(values(source, "high")).toEqual(["Node.js 18"]);
      expect(values(source, "low")).toEqual([]);
    }
  });

  // The plus must be adjacent. In 「Node.js 18 + npm 9」 it joins two requirements
  // rather than meaning "18 or later".
  test("does not treat a detached plus as a floor marker", () => {
    expect(values("Node.js 18 + npm 9 が必要", "high")).toEqual(["Node.js 18", "npm 9"]);
    expect(values("Node.js 18 + npm 9 が必要", "low")).toEqual([]);
  });

  test("carries the floor note so a reader knows why it was demoted", () => {
    const [claim] = extractVersionClaims("Git 2.23 以降で使えます");
    expect(claim?.note).toContain("下限表記");
  });

  test("keeps an exact version on the same line at high confidence", () => {
    expect(values("Git 2.23 以降。Python 3.13 で確認", "high")).toEqual(["Python 3.13"]);
    expect(values("Git 2.23 以降。Python 3.13 で確認", "low")).toEqual(["Git 2.23"]);
  });

  test("applies the floor rule to Tier B products too", () => {
    const [claim] = extractVersionClaims("Fastify 4.26.0 以降で対応");
    expect(claim?.confidence).toBe("low");
    expect(claim?.note).toContain("下限表記");
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

  // 「執筆時点」 contains 「時点」; emitting both would mean one assertion
  // needs two ignore entries to suppress.
  test("emits one claim when temporal phrases overlap", () => {
    expect(values("執筆時点では対応していません", "high")).toEqual(["執筆時点"]);
    expect(values("現時点での仕様です", "high")).toEqual(["現時点"]);
  });

  test("does not treat 時点で as a date claim by itself", () => {
    expect(values("手が空いた時点で 1 回だけ実行されます")).not.toContain("時点で");
  });

  // Regression: 「最新」 (weak) sits inside 「最新版」 (strong). Without checking
  // takenSpans, one assertion produced both confidences with two fingerprints —
  // ignoring the visible high-confidence claim left the low-confidence one behind.
  test("does not also emit a weak claim for a word inside an already-claimed strong phrase", () => {
    const withAnchor = "2026 年 6 月時点の最新版はこちら";
    expect(values(withAnchor, "high")).toContain("最新版");
    expect(values(withAnchor, "low")).not.toContain("最新");
  });

  test("still emits the weak claim when it does not overlap a strong phrase", () => {
    // "最新" here is not inside "最新版"/"最新モデル"/"最新のバージョン".
    const withAnchor = "2026 年 6 月時点、こちらが最新の情報です";
    expect(values(withAnchor, "low")).toContain("最新");
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
