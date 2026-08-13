/**
 * Priority scoring.
 *
 * Only the *ordering* is meaningful — the absolute number has no unit and is
 * never compared against a threshold. Its job is to put the articles most likely
 * to have gone stale at the top of a bucket, and to decide what `--max` truncates.
 */

import { STUB_BODY_CHARS } from "./dictionary";
import { isHighRiskHost } from "./extract";
import type { Claim } from "./types";

/**
 * A placeholder article rather than real content.
 *
 * `03-web-development-advanced` is 21 files averaging 378 characters, all of them
 * "TODO: この詳細ページは新規執筆予定です。". Those are *unfinished*, not stale,
 * and mixing them into the scores dilutes the ranking.
 */
export function isStub(body: string): boolean {
  return body.trim().length < STUB_BODY_CHARS;
}

const WEIGHTS = {
  url: 1,
  highRiskUrl: 3,
  versionHigh: 2,
  versionLow: 0.5,
  dateHigh: 2,
  dateLow: 0.25,
  recentYear: 1,
} as const;

/** Weighted claim count. Higher means "look at this article first". */
export function scoreClaims(claims: readonly Claim[]): number {
  let score = 0;

  for (const claim of claims) {
    switch (claim.kind) {
      case "url":
        score += WEIGHTS.url;
        if (isHighRiskHost(claim.value)) score += WEIGHTS.highRiskUrl;
        break;
      case "version":
        score += claim.confidence === "high" ? WEIGHTS.versionHigh : WEIGHTS.versionLow;
        break;
      case "date":
        score += claim.confidence === "high" ? WEIGHTS.dateHigh : WEIGHTS.dateLow;
        if (claim.note?.startsWith("直近の年号")) score += WEIGHTS.recentYear;
        break;
    }
  }

  return Math.round(score * 100) / 100;
}

/** Score an article. Stubs score 0 so they never crowd out real content. */
export function scoreLesson(claims: readonly Claim[], body: string): number {
  return isStub(body) ? 0 : scoreClaims(claims);
}
