/**
 * Extract "claims that can go stale" from a lesson's Markdown source.
 *
 * Every extractor takes an already-masked source (see `mask.ts`) and returns
 * claims carrying 1-indexed line numbers that line up with the raw file.
 */

import {
  buildProductVersionPattern,
  EXCLUDED_HOST_SUFFIXES,
  EXCLUDED_HOSTS,
  GENERIC_VERSION_PATTERN,
  HIGH_RISK_HOSTS,
  OWN_HOSTS,
  PLACEHOLDER_URL_PATTERN,
  STRONG_TEMPORAL_PHRASES,
  VERSION_STOPWORDS,
  WEAK_TEMPORAL_WORDS,
} from "./dictionary";
import { maskCodeRegions, paragraphRanges } from "./mask";
import type { Claim } from "./types";

/**
 * Bare URL run. `)` `]` `>` are excluded so Markdown `[text](url)` and autolinks
 * `<url>` terminate correctly. The cost is that a URL genuinely containing
 * parentheses (some Wikipedia article paths) is truncated — acceptable, since a
 * truncated URL surfaces as a link-check finding rather than being silently dropped.
 */
const URL_SOURCE = 'https?://[^\\s<>()\\[\\]"`|]+';

/** Punctuation that trails a URL in prose rather than belonging to it. */
const TRAILING_PUNCT_RE = /[.,;:!?、。）」』】>]+$/;

const YEAR_MONTH_SOURCE = "(?:19|20)\\d{2}\\s*年(?:\\s*\\d{1,2}\\s*月)?";
const ISO_DATE_SOURCE = "\\b(?:19|20)\\d{2}-\\d{2}-\\d{2}\\b";

interface SourceLine {
  lineNo: number;
  text: string;
}

function eachLine(masked: string): SourceLine[] {
  return masked.split("\n").map((text, i) => ({ lineNo: i + 1, text }));
}

/** Host of a URL, lowercased, or null when it doesn't parse. */
export function urlHost(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/** True when a URL is a real external reference worth checking, not an example. */
export function isCheckableUrl(url: string): boolean {
  const host = urlHost(url);
  if (!host) return false;
  if (EXCLUDED_HOSTS.has(host)) return false;
  if (EXCLUDED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) return false;
  if (OWN_HOSTS.has(host)) return false;
  if (PLACEHOLDER_URL_PATTERN.test(url)) return false;
  return true;
}

export function isHighRiskHost(url: string): boolean {
  const host = urlHost(url);
  return host !== null && HIGH_RISK_HOSTS.has(host);
}

export function extractUrls(masked: string): Claim[] {
  const claims: Claim[] = [];
  const pattern = new RegExp(URL_SOURCE, "g");

  for (const { lineNo, text } of eachLine(masked)) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null = pattern.exec(text);
    while (match !== null) {
      const url = match[0].replace(TRAILING_PUNCT_RE, "");
      if (isCheckableUrl(url)) {
        claims.push({
          kind: "url",
          value: url,
          line: lineNo,
          context: text.trim(),
          confidence: "high",
          note: isHighRiskHost(url)
            ? "統計・ベンチマーク系ドメイン。リンクが生きていても数値が古い可能性がある"
            : undefined,
        });
      }
      match = pattern.exec(text);
    }
  }

  return claims;
}

export function extractVersionClaims(masked: string): Claim[] {
  const claims: Claim[] = [];
  const tierA = buildProductVersionPattern();
  const tierB = new RegExp(GENERIC_VERSION_PATTERN.source, "g");

  for (const { lineNo, text } of eachLine(masked)) {
    // Character spans Tier A already claimed. Tracking positions rather than
    // strings is what stops a multi-word product name from also yielding its
    // tail: "Tailwind CSS 3.4" must not additionally report "CSS 3.4".
    const claimed: [number, number][] = [];

    tierA.lastIndex = 0;
    let a: RegExpExecArray | null = tierA.exec(text);
    while (a !== null) {
      claimed.push([a.index, a.index + a[0].length]);
      claims.push({
        kind: "version",
        value: a[0],
        line: lineNo,
        context: text.trim(),
        confidence: "high",
      });
      a = tierA.exec(text);
    }

    tierB.lastIndex = 0;
    let b: RegExpExecArray | null = tierB.exec(text);
    while (b !== null) {
      const [whole, word] = b;
      const start = b.index;
      const end = start + whole.length;
      const insideTierA = claimed.some(([s, e]) => start >= s && end <= e);
      if (!insideTierA && !VERSION_STOPWORDS.has(word)) {
        claims.push({
          kind: "version",
          value: whole,
          line: lineNo,
          context: text.trim(),
          confidence: "low",
          note: "製品名辞書に無い語。バージョン記述かどうかは要判断",
        });
      }
      b = tierB.exec(text);
    }
  }

  return claims;
}

/**
 * Year references, ISO dates, and Japanese point-in-time phrases.
 *
 * Weak words (bare 「現在」 and friends) are only emitted when their paragraph
 * also carries a year, a version-like number, or a URL — on their own they match
 * ~101 times across 71 files here and would swamp the report.
 *
 * Distinguishing a permanent historical fact (「2004年にGitが誕生」) from a
 * point-in-time claim (「2026年6月時点の仕様」) is not decidable here; that
 * judgement is exactly what the LLM stage is for. The year distance is recorded
 * as a hint.
 */
export function extractDateClaims(masked: string, now: Date = new Date()): Claim[] {
  const claims: Claim[] = [];
  const currentYear = now.getUTCFullYear();
  const lines = eachLine(masked);
  const paragraphs = paragraphRanges(masked);

  const yearMonth = new RegExp(YEAR_MONTH_SOURCE, "g");
  const isoDate = new RegExp(ISO_DATE_SOURCE, "g");
  const anchorInParagraph = new RegExp(
    `${YEAR_MONTH_SOURCE}|${ISO_DATE_SOURCE}|${URL_SOURCE}|\\d+\\.\\d+`,
  );

  const paragraphHasAnchor = (lineNo: number): boolean => {
    const range = paragraphs.find((r) => lineNo >= r.start && lineNo <= r.end);
    if (!range) return false;
    const body = lines
      .slice(range.start - 1, range.end)
      .map((l) => l.text)
      .join("\n");
    return anchorInParagraph.test(body);
  };

  for (const { lineNo, text } of lines) {
    const context = text.trim();

    yearMonth.lastIndex = 0;
    let ym: RegExpExecArray | null = yearMonth.exec(text);
    while (ym !== null) {
      const year = Number.parseInt(ym[0].slice(0, 4), 10);
      const age = currentYear - year;
      claims.push({
        kind: "date",
        value: ym[0],
        line: lineNo,
        context,
        confidence: "high",
        note:
          age <= 2
            ? "直近の年号。時点依存の記述である可能性が高い"
            : age >= 10
              ? "古い年号。歴史的事実の記述である可能性が高い"
              : undefined,
      });
      ym = yearMonth.exec(text);
    }

    isoDate.lastIndex = 0;
    let iso: RegExpExecArray | null = isoDate.exec(text);
    while (iso !== null) {
      claims.push({ kind: "date", value: iso[0], line: lineNo, context, confidence: "high" });
      iso = isoDate.exec(text);
    }

    // Longest phrase first, skipping any match that overlaps one already taken.
    // The phrase list contains both 「執筆時点」 and 「時点で」, which overlap in
    // 「執筆時点では」 — without this, one assertion yields two claims with two
    // different fingerprints, so suppressing it would need two ignore entries.
    const takenSpans: [number, number][] = [];
    for (const phrase of [...STRONG_TEMPORAL_PHRASES].sort((x, y) => y.length - x.length)) {
      let from = text.indexOf(phrase);
      while (from !== -1) {
        const to = from + phrase.length;
        const overlaps = takenSpans.some(([s, e]) => from < e && to > s);
        if (!overlaps) {
          takenSpans.push([from, to]);
          claims.push({ kind: "date", value: phrase, line: lineNo, context, confidence: "high" });
          break; // One claim per phrase per line; the fingerprint is per (file, value).
        }
        from = text.indexOf(phrase, from + 1);
      }
    }

    for (const word of WEAK_TEMPORAL_WORDS) {
      if (text.includes(word) && paragraphHasAnchor(lineNo)) {
        claims.push({
          kind: "date",
          value: word,
          line: lineNo,
          context,
          confidence: "low",
          note: "同一段落に年号・バージョン・URL があるため時点依存の可能性がある",
        });
      }
    }
  }

  return claims;
}

/** Mask code regions, then run every extractor over a raw lesson source. */
export function extractClaims(rawSource: string, now: Date = new Date()): Claim[] {
  const masked = maskCodeRegions(rawSource);
  return [
    ...extractUrls(masked),
    ...extractVersionClaims(masked),
    ...extractDateClaims(masked, now),
  ].sort((a, b) => a.line - b.line || a.kind.localeCompare(b.kind));
}
