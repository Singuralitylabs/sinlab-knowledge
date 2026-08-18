import { describe, expect, test } from "bun:test";
import { buildContentIndex } from "@/lib/content-index";
import { makeLesson, makeModule, makeTheme } from "./helpers/fixtures";

// Module shape:
//   l1 (lecture)
//   l2 (lecture) ── d1, d2 (details)
const d1 = makeLesson("d1", { parentSlug: "l2" });
const d2 = makeLesson("d2", { parentSlug: "l2" });
const l1 = makeLesson("l1", { frontmatter: { title: "レッスン 1" } });
const l2 = makeLesson("l2", { details: [d1, d2], frontmatter: { title: "レッスン 2" } });
const mod = makeModule("01-module", [l1, l2], { title: "モジュール" });
const theme = makeTheme("01-theme", [mod], { title: "テーマ", color: "blue", icon: "BookOpen" });

describe("buildContentIndex", () => {
  test("projects the theme header fields and counts", () => {
    const [entry] = buildContentIndex([theme]);
    expect(entry.slug).toBe("01-theme");
    expect(entry.title).toBe("テーマ");
    expect(entry.href).toBe("/themes/01-theme");
    expect(entry.color).toBe("blue");
    expect(entry.icon).toBe("BookOpen");
    expect(entry.moduleCount).toBe(1);
    expect(entry.lessonCount).toBe(2);
    expect(entry.isDraft).toBe(false);
  });

  test("emits module hrefs and per-module lesson counts", () => {
    const [entry] = buildContentIndex([theme]);
    const [module] = entry.modules;
    expect(module.title).toBe("モジュール");
    expect(module.href).toBe("/themes/01-theme/01-module");
    expect(module.lessonCount).toBe(2);
  });

  test("sums the theme lesson count across modules", () => {
    const multi = makeTheme("01-theme", [
      makeModule("01-a", [makeLesson("l1"), makeLesson("l2")]),
      makeModule("02-b", [makeLesson("l3")]),
      makeModule("03-empty", []),
    ]);
    const [entry] = buildContentIndex([multi]);
    expect(entry.moduleCount).toBe(3);
    expect(entry.lessonCount).toBe(3);
    expect(entry.modules.map((m) => m.lessonCount)).toEqual([2, 1, 0]);
  });

  test("lists lectures only — detail sub-pages stay out of the index", () => {
    const [entry] = buildContentIndex([theme]);
    expect(entry.modules[0].lessons).toEqual([
      {
        slug: "l1",
        title: "レッスン 1",
        href: "/themes/01-theme/01-module/l1",
        isDraft: false,
      },
      {
        slug: "l2",
        title: "レッスン 2",
        href: "/themes/01-theme/01-module/l2",
        isDraft: false,
      },
    ]);
  });

  test("does not carry the Markdown body into the projection", () => {
    const heavy = makeLesson("l1");
    heavy.body = "# 本文";
    const [entry] = buildContentIndex([makeTheme("01-theme", [makeModule("01-module", [heavy])])]);
    expect(Object.keys(entry.modules[0].lessons[0]).sort()).toEqual([
      "href",
      "isDraft",
      "slug",
      "title",
    ]);
  });

  test("flags draft themes / modules / lessons (dev-only — production strips them)", () => {
    const draftLesson = makeLesson("l1", { frontmatter: { status: "draft" } });
    const draftModule = makeModule("01-module", [draftLesson], { status: "draft" });
    const draftTheme = makeTheme("01-theme", [draftModule], { status: "draft" });
    const [entry] = buildContentIndex([draftTheme]);
    expect(entry.isDraft).toBe(true);
    expect(entry.modules[0].isDraft).toBe(true);
    expect(entry.modules[0].lessons[0].isDraft).toBe(true);
  });

  test("keeps theme, module and lesson order as loaded", () => {
    const themeA = makeTheme("01-a", [
      makeModule("02-second", [makeLesson("l2"), makeLesson("l1")]),
      makeModule("01-first", []),
    ]);
    const themeB = makeTheme("02-b", []);
    const index = buildContentIndex([themeA, themeB]);
    expect(index.map((t) => t.slug)).toEqual(["01-a", "02-b"]);
    expect(index[0].modules.map((m) => m.slug)).toEqual(["02-second", "01-first"]);
    expect(index[0].modules[0].lessons.map((l) => l.slug)).toEqual(["l2", "l1"]);
  });

  test("returns an empty list for an empty tree", () => {
    expect(buildContentIndex([])).toEqual([]);
  });
});
