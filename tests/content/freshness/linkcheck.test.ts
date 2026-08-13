import { describe, expect, test } from "bun:test";
import { checkUrl, checkUrls, classifyStatus } from "@/lib/content/freshness/linkcheck";

/** Minimal stand-in: checkUrl only reads `status` and `url`. */
function response(status: number, url: string): Response {
  return { status, url } as Response;
}

describe("classifyStatus", () => {
  test("treats 404 and 410 as dead", () => {
    expect(classifyStatus("https://a.test/x", 404, "https://a.test/x").status).toBe("dead");
    expect(classifyStatus("https://a.test/x", 410, "https://a.test/x").status).toBe("dead");
  });

  // The rule that keeps the report trustworthy: bot protection and rate limiting
  // are not broken links, and reporting them as such would flood the issue.
  test("never reports 403 or 429 as dead", () => {
    for (const status of [403, 429]) {
      const result = classifyStatus("https://a.test/x", status, "https://a.test/x");
      expect(result.status).toBe("unknown");
      expect(result.reason).toContain("レート制限");
    }
  });

  test("treats 5xx as unknown, not dead", () => {
    expect(classifyStatus("https://a.test/x", 503, "https://a.test/x").status).toBe("unknown");
  });

  test("treats a matching 2xx as alive", () => {
    expect(classifyStatus("https://a.test/x", 200, "https://a.test/x").status).toBe("alive");
  });

  test("treats a different final URL as moved", () => {
    const result = classifyStatus("https://a.test/old", 200, "https://a.test/new");
    expect(result.status).toBe("moved");
  });

  test("ignores trailing-slash and fragment differences", () => {
    expect(classifyStatus("https://a.test/docs", 200, "https://a.test/docs/").status).toBe("alive");
    expect(classifyStatus("https://a.test/docs", 200, "https://a.test/docs#top").status).toBe(
      "alive",
    );
  });
});

describe("checkUrl", () => {
  test("falls back to GET when HEAD is unsupported", async () => {
    const methods: string[] = [];
    const result = await checkUrl("https://a.test/x", [], {
      retries: 0,
      fetchFn: async (url, init) => {
        methods.push(String(init.method));
        return response(init.method === "HEAD" ? 405 : 200, url);
      },
    });

    expect(methods).toEqual(["HEAD", "GET"]);
    expect(result.status).toBe("alive");
  });

  test("retries a GET after a 403 HEAD before giving up", async () => {
    const methods: string[] = [];
    const result = await checkUrl("https://a.test/x", [], {
      retries: 0,
      fetchFn: async (url, init) => {
        methods.push(String(init.method));
        return response(403, url);
      },
    });

    expect(methods).toEqual(["HEAD", "GET"]);
    expect(result.status).toBe("unknown");
  });

  test("reports the referencing files alongside the result", async () => {
    const result = await checkUrl("https://a.test/x", ["content/a.md"], {
      retries: 0,
      fetchFn: async (url) => response(404, url),
    });

    expect(result.status).toBe("dead");
    expect(result.httpStatus).toBe(404);
    expect(result.files).toEqual(["content/a.md"]);
  });

  // Some hosts 404 a HEAD but serve the page over GET. A confirmed `dead` opens
  // its own issue, so that false positive is worth one extra request to avoid.
  test("retries with GET when HEAD returns 404, and trusts the GET", async () => {
    const methods: string[] = [];
    const result = await checkUrl("https://a.test/x", [], {
      retries: 0,
      fetchFn: async (url, init) => {
        methods.push(String(init.method));
        return response(init.method === "HEAD" ? 404 : 200, url);
      },
    });

    expect(methods).toEqual(["HEAD", "GET"]);
    expect(result.status).toBe("alive");
  });

  test("still reports dead when GET also returns 404", async () => {
    const result = await checkUrl("https://a.test/x", [], {
      retries: 0,
      fetchFn: async (url) => response(404, url),
    });

    expect(result.status).toBe("dead");
  });

  test("records the final URL when redirected", async () => {
    const result = await checkUrl("https://a.test/old", [], {
      retries: 0,
      fetchFn: async () => response(200, "https://a.test/new"),
    });

    expect(result.status).toBe("moved");
    expect(result.finalUrl).toBe("https://a.test/new");
  });

  test("classifies a network failure as unknown rather than dead", async () => {
    const result = await checkUrl("https://a.test/x", [], {
      retries: 0,
      fetchFn: async () => {
        throw new Error("timeout");
      },
    });

    expect(result.status).toBe("unknown");
    expect(result.httpStatus).toBeNull();
    expect(result.reason).toContain("timeout");
  });

  test("retries transient 5xx then settles on unknown", async () => {
    let calls = 0;
    const result = await checkUrl("https://a.test/x", [], {
      retries: 1,
      fetchFn: async (url) => {
        calls++;
        return response(500, url);
      },
    });

    expect(calls).toBeGreaterThan(1);
    expect(result.status).toBe("unknown");
  });
});

describe("checkUrls", () => {
  test("returns results in input order regardless of completion order", async () => {
    const entries = [
      { url: "https://a.test/1", files: [] },
      { url: "https://b.test/2", files: [] },
      { url: "https://c.test/3", files: [] },
    ];

    const results = await checkUrls(entries, {
      retries: 0,
      perHostDelayMs: 0,
      fetchFn: async (url) => {
        // Finish in reverse order.
        await new Promise((r) => setTimeout(r, url.endsWith("1") ? 15 : 0));
        return response(200, url);
      },
    });

    expect(results.map((r) => r.url)).toEqual(entries.map((e) => e.url));
  });

  test("handles an empty input list", async () => {
    expect(await checkUrls([], { retries: 0 })).toEqual([]);
  });

  // Reading the host's last-hit time before sleeping and writing it after waking
  // lets every queued worker wake together, bursting the host — which is exactly
  // what the delay exists to prevent.
  test("spaces same-host requests instead of releasing them in a burst", async () => {
    const entries = Array.from({ length: 4 }, (_, i) => ({
      url: `https://same.test/${i}`,
      files: [],
    }));
    const startedAt: number[] = [];

    await checkUrls(entries, {
      retries: 0,
      concurrency: 4,
      perHostDelayMs: 30,
      fetchFn: async (url) => {
        startedAt.push(Date.now());
        return response(200, url);
      },
    });

    startedAt.sort((a, b) => a - b);
    for (let i = 1; i < startedAt.length; i++) {
      // Allow a little scheduler slack, but nothing close to a simultaneous burst.
      expect(startedAt[i] - startedAt[i - 1]).toBeGreaterThanOrEqual(20);
    }
  });

  test("does not delay requests to different hosts", async () => {
    const entries = Array.from({ length: 4 }, (_, i) => ({
      url: `https://host${i}.test/`,
      files: [],
    }));
    const began = Date.now();

    await checkUrls(entries, {
      retries: 0,
      concurrency: 4,
      perHostDelayMs: 200,
      fetchFn: async (url) => response(200, url),
    });

    expect(Date.now() - began).toBeLessThan(200);
  });
});
