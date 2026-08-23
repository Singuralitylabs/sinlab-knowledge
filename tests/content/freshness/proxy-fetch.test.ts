import { describe, expect, test } from "bun:test";
import {
  buildCurlArgs,
  parseCurlWriteOut,
  resolveProxyUrl,
  selectFetchFn,
} from "@/lib/content/freshness/proxy-fetch";

describe("resolveProxyUrl", () => {
  test("prefers HTTPS_PROXY over HTTP_PROXY", () => {
    expect(
      resolveProxyUrl({
        HTTPS_PROXY: "http://https-proxy:8080",
        HTTP_PROXY: "http://http-proxy:8080",
      }),
    ).toBe("http://https-proxy:8080");
  });

  test("accepts lowercase env names", () => {
    expect(resolveProxyUrl({ https_proxy: "http://p:1" })).toBe("http://p:1");
  });

  test("returns undefined when no proxy is configured", () => {
    expect(resolveProxyUrl({})).toBeUndefined();
  });
});

describe("parseCurlWriteOut", () => {
  test("splits status and final URL", () => {
    expect(parseCurlWriteOut("200 https://example.com/x")).toEqual({
      httpStatus: 200,
      finalUrl: "https://example.com/x",
    });
  });

  test("keeps the rest of the line as the URL", () => {
    expect(parseCurlWriteOut("301 https://example.com/a b")).toEqual({
      httpStatus: 301,
      finalUrl: "https://example.com/a b",
    });
  });

  test("rejects output with no status/URL split", () => {
    expect(() => parseCurlWriteOut("oops")).toThrow(/解釈できません/);
  });
});

describe("selectFetchFn", () => {
  test("keeps an injected fetchFn", () => {
    const fetchFn = async () => ({ status: 200, url: "https://x" }) as Response;
    expect(selectFetchFn({ fetchFn, env: { HTTPS_PROXY: "http://p" } }).via).toBe("inject");
  });

  test("uses curl when a proxy env var is set", () => {
    expect(selectFetchFn({ env: { HTTPS_PROXY: "http://p:8080" } }).via).toBe("curl");
  });

  test("uses native fetch when no proxy is set", () => {
    expect(selectFetchFn({ env: {} }).via).toBe("native");
  });
});

describe("buildCurlArgs", () => {
  test("uses -I for HEAD instead of -X HEAD", () => {
    const args = buildCurlArgs("https://example.com/x", { method: "HEAD" });
    expect(args).toContain("-I");
    expect(args).not.toContain("-X");
    expect(args).not.toContain("HEAD");
    expect(args.at(-2)).toBe("--");
    expect(args.at(-1)).toBe("https://example.com/x");
  });

  test("keeps -X for GET", () => {
    const args = buildCurlArgs("https://example.com/x", { method: "GET" });
    expect(args).not.toContain("-I");
    expect(args).toContain("-X");
    expect(args).toContain("GET");
  });
});
