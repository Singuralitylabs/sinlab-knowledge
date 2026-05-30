import { describe, expect, test } from "bun:test";
import {
  collectAllLessonPaths,
  collectAllModulePaths,
  collectLessonsByTag,
  resolveAdjacentLessons,
} from "@/lib/themes";
import { makeLesson, makeModule, makeTheme } from "../helpers/fixtures";

// Module shape:
//   l1 (lecture)
//   l2 (lecture) ── d1, d2 (details)
//   l3 (lecture)
const d1 = makeLesson("d1", { parentSlug: "l2" });
const d2 = makeLesson("d2", { parentSlug: "l2" });
const l1 = makeLesson("l1");
const l2 = makeLesson("l2", { details: [d1, d2] });
const l3 = makeLesson("l3");
const mod = makeModule("01-module", [l1, l2, l3]);

describe("resolveAdjacentLessons — top-level lectures", () => {
  test("first lecture has no prev", () => {
    expect(resolveAdjacentLessons(l1, mod)).toEqual({ prev: null, next: l2 });
  });

  test("middle lecture navigates among lectures, skipping details", () => {
    expect(resolveAdjacentLessons(l2, mod)).toEqual({ prev: l1, next: l3 });
  });

  test("last lecture has no next", () => {
    expect(resolveAdjacentLessons(l3, mod)).toEqual({ prev: l2, next: null });
  });
});

describe("resolveAdjacentLessons — details", () => {
  test("details navigate only among their siblings", () => {
    expect(resolveAdjacentLessons(d1, mod)).toEqual({ prev: null, next: d2 });
    expect(resolveAdjacentLessons(d2, mod)).toEqual({ prev: d1, next: null });
  });
});

describe("collectAllLessonPaths", () => {
  test("emits a path per lecture and per detail", () => {
    const theme = makeTheme("01-theme", [mod]);
    expect(collectAllLessonPaths([theme])).toEqual([
      { themeSlug: "01-theme", slug: ["01-module", "l1"] },
      { themeSlug: "01-theme", slug: ["01-module", "l2"] },
      { themeSlug: "01-theme", slug: ["01-module", "l2", "d1"] },
      { themeSlug: "01-theme", slug: ["01-module", "l2", "d2"] },
      { themeSlug: "01-theme", slug: ["01-module", "l3"] },
    ]);
  });
});

describe("collectAllModulePaths", () => {
  test("emits one path per module", () => {
    const theme = makeTheme("01-theme", [mod]);
    expect(collectAllModulePaths([theme])).toEqual([
      { themeSlug: "01-theme", slug: ["01-module"] },
    ]);
  });
});

describe("collectLessonsByTag", () => {
  test("matches lectures and details carrying the tag", () => {
    const tagged = makeLesson("tagged", { frontmatter: { tags: ["git"] } });
    const taggedDetail = makeLesson("tagged-detail", {
      parentSlug: "tagged",
      frontmatter: { tags: ["git"] },
    });
    const untagged = makeLesson("untagged", { frontmatter: { tags: ["docker"] } });
    const lecture = makeLesson("lecture", {
      frontmatter: { tags: ["git"] },
      details: [taggedDetail],
    });
    const theme = makeTheme("01-theme", [makeModule("01-module", [tagged, untagged, lecture])]);

    const result = collectLessonsByTag([theme], "git");
    expect(result.map((l) => l.slug)).toEqual(["tagged", "lecture", "tagged-detail"]);
  });
});
