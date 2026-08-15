import { describe, expect, test } from "bun:test";
import { isProtectedPath } from "@/lib/auth/route-protection";

describe("isProtectedPath — public list pages", () => {
  test.each([
    "/themes",
    "/themes/01-theme",
    "/themes/01-theme/01-module",
  ])("%s is public", (pathname) => {
    expect(isProtectedPath(pathname)).toBe(false);
  });
});

describe("isProtectedPath — protected article pages", () => {
  test.each([
    "/themes/01-theme/01-module/lesson",
    "/themes/01-theme/01-module/lesson/detail",
  ])("%s requires auth", (pathname) => {
    expect(isProtectedPath(pathname)).toBe(true);
  });
});

describe("isProtectedPath — unrelated paths", () => {
  test.each(["/", "/about", "/login", "/content-assets/foo.png"])("%s is public", (pathname) => {
    expect(isProtectedPath(pathname)).toBe(false);
  });
});
