/**
 * Shared types for the content freshness pipeline.
 *
 * The pipeline runs in three stages:
 *   1. Deterministic scan   — extract "claims that can go stale" from every lesson (no tokens)
 *   2. Deterministic link check — resolve external URLs over HTTP (no tokens)
 *   3. LLM review           — judge whether the surviving claims are actually outdated
 *
 * Stages 1 and 2 exist so that stage 3 only ever sees a small, pre-filtered slice.
 */

/** What kind of potentially-stale assertion a {@link Claim} represents. */
export type ClaimKind = "url" | "version" | "date";

/**
 * Confidence that a claim is worth a human's attention.
 *
 * `high` claims are reported by default. `low` claims are hints kept in the JSON
 * output but hidden from the Markdown report unless explicitly requested — they
 * exist to give the LLM stage extra context without drowning the report in noise.
 */
export type Confidence = "high" | "low";

export interface Claim {
  kind: ClaimKind;
  /** The matched text, e.g. `https://example.org/x`, `Node.js 18`, `2026 年 6 月`. */
  value: string;
  /** 1-indexed line number in the **raw** source file (frontmatter included). */
  line: number;
  /** The source line, trimmed, so the report can show the claim in context. */
  context: string;
  confidence: Confidence;
  /**
   * Why this claim was flagged, in Japanese, for the report.
   * e.g. "統計・ベンチマーク系ドメイン（数値が古びやすい）".
   */
  note?: string;
}

/** Outcome of resolving a single external URL. */
export type LinkStatus =
  /** 2xx/3xx and the final URL matches what we asked for. */
  | "alive"
  /** 404 / 410 — a real broken link. */
  | "dead"
  /** Resolved, but to a different URL than requested. The target may have been re-organised. */
  | "moved"
  /** 403 / 429 / timeout / 5xx. Bot protection and rate limits look like this — never report as dead. */
  | "unknown";

export interface LinkResult {
  url: string;
  status: LinkStatus;
  /** HTTP status code, or null when the request never completed. */
  httpStatus: number | null;
  /** Final URL after redirects, when it differs from `url`. */
  finalUrl: string | null;
  /** Human-readable explanation, in Japanese, for the report. */
  reason: string;
  /** Repo-relative files that reference this URL. */
  files: string[];
}

/** One lesson's scan result. */
export interface LessonScan {
  /** Repo-relative path, e.g. `content/themes/04-.../lessons/06-benchmarks.md`. */
  file: string;
  themeSlug: string;
  moduleSlug: string;
  title: string;
  /** `status: draft` in frontmatter. Included in scans; flagged in the report. */
  draft: boolean;
  /** Placeholder article (body under the stub threshold) — unfinished, not stale. */
  stub: boolean;
  charCount: number;
  /** Relative priority. Only the ordering is meaningful, not the absolute value. */
  score: number;
  /** Rotation bucket derived from a stable hash of `file`. */
  bucket: number;
  claims: Claim[];
}

/** A `/themes/...` link that doesn't resolve to a real page. */
export interface InternalLinkIssue {
  /** Repo-relative file containing the broken link. */
  file: string;
  line: number;
  href: string;
  context: string;
}

export interface ScanTotals {
  lessons: number;
  candidates: number;
  stubs: number;
  urlClaims: number;
  uniqueUrls: number;
  versionClaims: number;
  dateClaims: number;
  internalLinkIssues: number;
}

export interface ScanResult {
  generatedAt: string;
  /** Epoch-based absolute week index — see `rotation.ts`. */
  weekIndex: number;
  bucketCount: number;
  /** Bucket selected for this run, or null when scanning everything. */
  selectedBucket: number | null;
  totals: ScanTotals;
  /** Lessons selected for review this run (after bucket/max filtering). */
  lessons: LessonScan[];
  /** Unique external URLs across the selected lessons, for the link-check stage. */
  urls: string[];
  /** Broken internal links across **all** lessons (cheap and deterministic, never sampled). */
  internalLinkIssues: InternalLinkIssue[];
  /** Non-fatal problems with the scan itself, e.g. git history unavailable. */
  warnings: string[];
}
