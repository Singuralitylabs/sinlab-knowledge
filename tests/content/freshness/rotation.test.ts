import { describe, expect, test } from "bun:test";
import {
  bucketOf,
  fnv1a32,
  selectCandidates,
  selectedBucket,
  weekIndex,
} from "@/lib/content/freshness/rotation";

describe("weekIndex", () => {
  test("increments by exactly one per week", () => {
    const a = weekIndex(new Date("2026-08-10T00:00:00Z"));
    const b = weekIndex(new Date("2026-08-17T00:00:00Z"));
    expect(b - a).toBe(1);
  });

  test("is stable across times of day", () => {
    expect(weekIndex(new Date("2026-08-10T00:00:00Z"))).toBe(
      weekIndex(new Date("2026-08-10T23:59:59Z")),
    );
  });

  // The reason this is an epoch-based index rather than the ISO week number:
  // 2026 is a 53-week ISO year, so `isoWeek % n` would skip or repeat a bucket here.
  test("stays continuous across a 53-week ISO year boundary", () => {
    const before = weekIndex(new Date("2026-12-28T00:00:00Z"));
    const after = weekIndex(new Date("2027-01-04T00:00:00Z"));
    expect(after - before).toBe(1);
  });

  test("produces an unbroken round robin across a year boundary", () => {
    const buckets: number[] = [];
    for (let day = 0; day < 7 * 8; day += 7) {
      const date = new Date(Date.UTC(2026, 11, 3) + day * 86_400_000);
      buckets.push(selectedBucket(weekIndex(date), 4));
    }
    // Every consecutive pair advances by exactly one bucket, wrapping at 4.
    for (let i = 1; i < buckets.length; i++) {
      expect((buckets[i - 1] + 1) % 4).toBe(buckets[i]);
    }
  });
});

describe("fnv1a32", () => {
  test("is deterministic and stays in unsigned 32-bit range", () => {
    const hash = fnv1a32("content/themes/01-web-basics/02-git/lessons/01-intro.md");
    expect(hash).toBe(fnv1a32("content/themes/01-web-basics/02-git/lessons/01-intro.md"));
    expect(hash).toBeGreaterThanOrEqual(0);
    expect(hash).toBeLessThanOrEqual(0xffffffff);
    expect(Number.isInteger(hash)).toBe(true);
  });

  test("separates similar paths", () => {
    expect(fnv1a32("lessons/01-a.md")).not.toBe(fnv1a32("lessons/01-b.md"));
  });
});

describe("bucketOf", () => {
  const paths = Array.from({ length: 56 }, (_, i) => `content/themes/t/m/lessons/${i}-lesson.md`);

  test("returns a bucket within range", () => {
    for (const p of paths) {
      const bucket = bucketOf(p, 4);
      expect(bucket).toBeGreaterThanOrEqual(0);
      expect(bucket).toBeLessThan(4);
    }
  });

  // The reason this hashes the path rather than indexing a sorted list: with
  // `sortedFiles[i] % n`, inserting one file shifts every later file's bucket.
  test("adding a new file does not move any existing file's bucket", () => {
    const before = new Map(paths.map((p) => [p, bucketOf(p, 4)]));
    // Simulate inserting a file that sorts before every existing one.
    const withNewFile = ["content/themes/t/m/lessons/00-brand-new.md", ...paths];
    expect(withNewFile).toHaveLength(paths.length + 1);
    for (const [p, bucket] of before) {
      expect(bucketOf(p, 4)).toBe(bucket);
    }
  });

  test("distributes without an extreme skew", () => {
    const counts = [0, 0, 0, 0];
    for (const p of paths) counts[bucketOf(p, 4)]++;
    const average = paths.length / 4;
    expect(Math.max(...counts)).toBeLessThanOrEqual(average * 2);
    expect(Math.min(...counts)).toBeGreaterThan(0);
  });

  test("rejects a non-positive bucket count", () => {
    expect(() => bucketOf("a.md", 0)).toThrow();
  });
});

describe("selectCandidates", () => {
  const lessons = [
    { file: "a.md", bucket: 0, score: 5 },
    { file: "b.md", bucket: 1, score: 9 },
    { file: "c.md", bucket: 0, score: 7 },
    { file: "d.md", bucket: 1, score: 1 },
  ];

  test("takes only the requested bucket", () => {
    expect(selectCandidates(lessons, { bucket: 0 }).map((l) => l.file)).toEqual(["c.md", "a.md"]);
  });

  test("sorts by score descending, then by path", () => {
    expect(selectCandidates(lessons, { all: true }).map((l) => l.file)).toEqual([
      "b.md",
      "c.md",
      "a.md",
      "d.md",
    ]);
  });

  // A freshly written article is the most likely to carry a point-in-time claim,
  // so it must not wait at the back of an n-week queue.
  test("always includes recently changed files regardless of bucket", () => {
    const withNewArrival = [
      ...lessons,
      { file: "new.md", bucket: 3, score: 0, recentlyChanged: true },
    ];
    expect(selectCandidates(withNewArrival, { bucket: 0 }).map((l) => l.file)).toEqual([
      "c.md",
      "a.md",
      "new.md",
    ]);
    expect(selectCandidates(withNewArrival, { bucket: 2 }).map((l) => l.file)).toEqual(["new.md"]);
  });

  test("caps the result with max, keeping the highest scores", () => {
    expect(selectCandidates(lessons, { all: true, max: 2 }).map((l) => l.file)).toEqual([
      "b.md",
      "c.md",
    ]);
  });

  test("is deterministic across calls", () => {
    expect(selectCandidates(lessons, { all: true })).toEqual(
      selectCandidates(lessons, { all: true }),
    );
  });
});
