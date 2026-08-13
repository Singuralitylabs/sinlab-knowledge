import { describe, expect, test } from "bun:test";
import { isStub, scoreClaims, scoreLesson } from "@/lib/content/freshness/score";
import type { Claim } from "@/lib/content/freshness/types";

function claim(overrides: Partial<Claim> & Pick<Claim, "kind" | "value">): Claim {
  return { line: 1, context: "", confidence: "high", ...overrides };
}

describe("isStub", () => {
  // 03-web-development-advanced is 21 files averaging 378 characters, all of them
  // "TODO: この詳細ページは新規執筆予定です。" — unfinished, not stale.
  test("treats a placeholder body as a stub", () => {
    expect(isStub("TODO: この詳細ページは新規執筆予定です。")).toBe(true);
  });

  test("treats a real article as content", () => {
    expect(isStub("あ".repeat(600))).toBe(false);
  });

  test("ignores surrounding whitespace", () => {
    expect(isStub(`\n\n  ${"あ".repeat(400)}  \n`)).toBe(true);
  });
});

describe("scoreClaims", () => {
  test("weights a benchmark host above an ordinary link", () => {
    const ordinary = scoreClaims([claim({ kind: "url", value: "https://git-scm.com/doc" })]);
    const benchmark = scoreClaims([
      claim({ kind: "url", value: "https://artificialanalysis.ai/" }),
    ]);
    expect(benchmark).toBeGreaterThan(ordinary);
  });

  test("weights high-confidence claims above low-confidence ones", () => {
    const high = scoreClaims([claim({ kind: "version", value: "Node.js 18" })]);
    const low = scoreClaims([claim({ kind: "version", value: "Foo 1.2", confidence: "low" })]);
    expect(high).toBeGreaterThan(low);
  });

  test("adds weight for a recent year", () => {
    const recent = scoreClaims([
      claim({
        kind: "date",
        value: "2026 年 6 月",
        note: "直近の年号。時点依存の記述である可能性が高い",
      }),
    ]);
    const plain = scoreClaims([claim({ kind: "date", value: "2015年3月" })]);
    expect(recent).toBeGreaterThan(plain);
  });

  test("accumulates across claims", () => {
    const claims = [
      claim({ kind: "url", value: "https://git-scm.com/doc" }),
      claim({ kind: "version", value: "Git 2.23" }),
    ];
    expect(scoreClaims(claims)).toBe(scoreClaims([claims[0]]) + scoreClaims([claims[1]]));
  });

  test("scores nothing for no claims", () => {
    expect(scoreClaims([])).toBe(0);
  });
});

describe("scoreLesson", () => {
  test("zeroes stubs so they never crowd out real content", () => {
    const claims = [claim({ kind: "url", value: "https://artificialanalysis.ai/" })];
    expect(scoreLesson(claims, "TODO: 執筆予定")).toBe(0);
    expect(scoreLesson(claims, "あ".repeat(600))).toBeGreaterThan(0);
  });
});
