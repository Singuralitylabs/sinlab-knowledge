import { describe, expect, test } from "bun:test";
import {
  extractOrderPrefix,
  fileNameToSlug,
  stripOrderPrefix,
  toUrlSlug,
} from "@/lib/content/slug";

describe("stripOrderPrefix", () => {
  test("strips the NN- prefix and trailing .md", () => {
    expect(stripOrderPrefix("01-markdown")).toBe("markdown");
    expect(stripOrderPrefix("02-headings.md")).toBe("headings");
    expect(stripOrderPrefix("10-multi-word-slug.md")).toBe("multi-word-slug");
  });

  test("leaves names without a numeric prefix untouched", () => {
    expect(stripOrderPrefix("no-prefix.md")).toBe("no-prefix");
    expect(stripOrderPrefix("intro")).toBe("intro");
  });
});

describe("extractOrderPrefix", () => {
  test("returns the numeric prefix when present", () => {
    expect(extractOrderPrefix("01-markdown")).toBe(1);
    expect(extractOrderPrefix("12-foo.md")).toBe(12);
  });

  test("returns null when there is no prefix", () => {
    expect(extractOrderPrefix("markdown")).toBeNull();
    expect(extractOrderPrefix("foo-1-bar")).toBeNull();
  });
});

describe("fileNameToSlug", () => {
  test("preserves the NN- prefix but strips .md", () => {
    expect(fileNameToSlug("02-headings.md")).toBe("02-headings");
    expect(fileNameToSlug("index.md")).toBe("index");
  });
});

describe("toUrlSlug", () => {
  test("produces the URL-facing slug (prefix stripped)", () => {
    expect(toUrlSlug("03-what-is-git.md")).toBe("what-is-git");
    expect(toUrlSlug("01-intro")).toBe("intro");
  });
});
