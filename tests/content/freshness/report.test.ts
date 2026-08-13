import { describe, expect, test } from "bun:test";
import {
  applyIgnoreList,
  fingerprint,
  formatMarkdown,
  parseIgnoreList,
} from "@/lib/content/freshness/report";
import type { Claim, LessonScan, ScanResult } from "@/lib/content/freshness/types";

function claim(value: string, line: number, overrides: Partial<Claim> = {}): Claim {
  return { kind: "url", value, line, context: "", confidence: "high", ...overrides };
}

function lesson(overrides: Partial<LessonScan> = {}): LessonScan {
  return {
    file: "content/themes/t/m/lessons/01-a.md",
    themeSlug: "t",
    moduleSlug: "m",
    title: "記事",
    draft: false,
    stub: false,
    charCount: 1000,
    score: 5,
    bucket: 0,
    claims: [],
    ...overrides,
  };
}

function scan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    generatedAt: "2026-08-10T00:00:00.000Z",
    weekIndex: 2953,
    bucketCount: 4,
    selectedBucket: 1,
    totals: {
      lessons: 202,
      candidates: 56,
      stubs: 21,
      urlClaims: 154,
      uniqueUrls: 107,
      versionClaims: 15,
      dateClaims: 85,
      internalLinkIssues: 0,
    },
    lessons: [],
    urls: [],
    internalLinkIssues: [],
    warnings: [],
    ...overrides,
  };
}

describe("fingerprint", () => {
  test("is stable for the same file and value", () => {
    expect(fingerprint("a.md", "https://x.test/")).toBe(fingerprint("a.md", "https://x.test/"));
  });

  test("differs per file, so suppressing one article does not silence another", () => {
    expect(fingerprint("a.md", "https://x.test/")).not.toBe(fingerprint("b.md", "https://x.test/"));
  });

  test("is short enough to paste into the ignore file", () => {
    expect(fingerprint("a.md", "x")).toHaveLength(8);
  });
});

describe("parseIgnoreList", () => {
  test("reads one fingerprint per line and strips inline comments", () => {
    const parsed = parseIgnoreList(
      ["# 見出しコメント", "", "a1b2c3d4  # 歴史的事実なので陳腐化しない", "deadbeef"].join("\n"),
    );
    expect([...parsed].sort()).toEqual(["a1b2c3d4", "deadbeef"]);
  });

  test("returns an empty set for an all-comment file", () => {
    expect(parseIgnoreList("# nothing here\n\n").size).toBe(0);
  });
});

describe("applyIgnoreList", () => {
  const target = claim("https://x.test/", 1);
  const other = claim("https://y.test/", 2);
  const lessons = [lesson({ claims: [target, other] })];

  test("drops only the ignored claim", () => {
    const id = fingerprint(lessons[0].file, target.value);
    const [result] = applyIgnoreList(lessons, new Set([id]));
    expect(result.claims.map((c) => c.value)).toEqual([other.value]);
  });

  test("is a no-op for an empty ignore list", () => {
    expect(applyIgnoreList(lessons, new Set())).toEqual(lessons);
  });
});

describe("formatMarkdown", () => {
  test("groups repeated occurrences under one fingerprint row", () => {
    // A fingerprint covers (file, value), so suppressing it suppresses every
    // occurrence — the report must not imply they are separately dismissible.
    const url = "https://artificialanalysis.ai/";
    const output = formatMarkdown(
      scan({ lessons: [lesson({ claims: [claim(url, 79), claim(url, 80), claim(url, 81)] })] }),
    );
    const rows = output.split("\n").filter((l) => l.includes(url));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toContain("L79, L80, L81");
  });

  test("collapses more than three occurrences into a count", () => {
    const url = "https://x.test/";
    const claims = [79, 80, 81, 82].map((l) => claim(url, l));
    const output = formatMarkdown(scan({ lessons: [lesson({ claims })] }));
    expect(output).toContain("L79 ほか3件");
  });

  test("hides low-confidence claims unless asked", () => {
    const claims = [claim("Foo 1.2", 5, { kind: "version", confidence: "low" })];
    expect(formatMarkdown(scan({ lessons: [lesson({ claims })] }))).not.toContain("Foo 1.2");
    expect(formatMarkdown(scan({ lessons: [lesson({ claims })] }), { includeLow: true })).toContain(
      "Foo 1.2",
    );
  });

  test("surfaces warnings prominently", () => {
    const output = formatMarkdown(
      scan({ warnings: ["shallow clone のため git 履歴が不完全です。"] }),
    );
    expect(output).toContain("[!WARNING]");
    expect(output).toContain("shallow clone");
  });

  test("reports internal link breakage separately from the rotation sample", () => {
    const output = formatMarkdown(
      scan({
        internalLinkIssues: [
          { file: "content/a.md", line: 43, href: "/themes/web-basics/vscode", context: "" },
        ],
      }),
    );
    expect(output).toContain("内部リンク切れ");
    expect(output).toContain("/themes/web-basics/vscode");
  });

  test("says so plainly when there is nothing to review", () => {
    expect(formatMarkdown(scan())).toContain("該当なし");
  });
});
