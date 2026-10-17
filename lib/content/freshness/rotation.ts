/**
 * Deterministic, state-free rotation.
 *
 * Reviewing every candidate article on every run is wasteful, so each run takes
 * one bucket. Both halves of the scheme are chosen to avoid needing a state file:
 * the week index is derived from the date, and bucket membership from the file path.
 */

/**
 * Absolute week number since the Unix epoch.
 *
 * Deliberately **not** the ISO week number: 53-week ISO years break
 * `isoWeek % bucketCount` round robin at the year boundary.
 */
export function weekIndex(date: Date): number {
  const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor(utcMidnight / 86_400_000 / 7);
}

/** FNV-1a 32-bit. Small, dependency-free, and stable across runs and platforms. */
export function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // hash * 16777619, kept in 32-bit range without overflowing to float.
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Bucket for a file, from a stable hash of its path.
 *
 * Deliberately **not** an index into a sorted list: inserting one file would shift
 * every later file's bucket. Cost: uneven bucket sizes, bounded by `--max`.
 */
export function bucketOf(filePath: string, bucketCount: number): number {
  if (bucketCount <= 0) throw new Error("bucketCount must be >= 1");
  return fnv1a32(filePath) % bucketCount;
}

/** Bucket due this week. Guards against a negative index for pre-epoch dates. */
export function selectedBucket(weekIdx: number, bucketCount: number): number {
  if (bucketCount <= 0) throw new Error("bucketCount must be >= 1");
  return ((weekIdx % bucketCount) + bucketCount) % bucketCount;
}

export interface SelectableLesson {
  file: string;
  bucket: number;
  score: number;
  /** True when the file changed recently enough to bypass the rotation. */
  recentlyChanged?: boolean;
}

export interface SelectOptions {
  /** Ignore bucketing and take everything. */
  all?: boolean;
  /** Bucket to take. Ignored when `all` is set. */
  bucket?: number;
  /** Upper bound on returned lessons, applied after sorting by score. */
  max?: number;
}

/**
 * Choose the lessons to review this run: the due bucket, plus anything flagged
 * as recently changed.
 *
 * The "new arrivals" lane matters because a freshly written article is the most
 * likely to contain a point-in-time claim, and putting it at the back of an
 * n-week queue is exactly backwards.
 *
 * Ordering is by score descending, then path, so the result is fully
 * deterministic and `max` truncates the least interesting entries.
 */
export function selectCandidates<T extends SelectableLesson>(
  lessons: readonly T[],
  options: SelectOptions = {},
): T[] {
  const { all = false, bucket, max } = options;

  const selected = all
    ? [...lessons]
    : lessons.filter(
        (l) => l.recentlyChanged === true || (bucket !== undefined && l.bucket === bucket),
      );

  selected.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));
  return max !== undefined && max > 0 ? selected.slice(0, max) : selected;
}
