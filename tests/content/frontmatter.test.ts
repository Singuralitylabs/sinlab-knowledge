import { describe, expect, test } from "bun:test";
import { parseLessonSource } from "@/lib/content/frontmatter";

const validSource = `---
title: "イントロダクション"
order: 1
type: lecture
difficulty: beginner
---
本文テキスト
`;

describe("parseLessonSource", () => {
  test("parses valid frontmatter and applies schema defaults", () => {
    const { frontmatter, body } = parseLessonSource(validSource, "intro.md");
    expect(frontmatter.title).toBe("イントロダクション");
    expect(frontmatter.order).toBe(1);
    expect(frontmatter.type).toBe("lecture");
    // Optional array/enum fields fall back to their schema defaults.
    expect(frontmatter.tags).toEqual([]);
    expect(frontmatter.status).toBe("published");
    expect(frontmatter.relatedLessons).toEqual([]);
    expect(frontmatter.authors).toEqual([]);
    expect(body.trim()).toBe("本文テキスト");
  });

  test("throws when a required field is missing", () => {
    const missingOrder = `---
title: "no order"
type: lecture
difficulty: beginner
---
body
`;
    expect(() => parseLessonSource(missingOrder, "broken.md")).toThrow(
      /Invalid frontmatter in broken\.md/,
    );
  });

  test("throws when an enum value is out of range", () => {
    const badDifficulty = `---
title: "bad difficulty"
order: 1
type: lecture
difficulty: expert
---
body
`;
    expect(() => parseLessonSource(badDifficulty, "bad.md")).toThrow(/Invalid frontmatter/);
  });
});
