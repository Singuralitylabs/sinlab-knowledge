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
  PLACEHOLDER_IMAGE_HOSTS,
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

/**
 * "Available from this version onward" notation directly after a version:
 * 「Git 2.23 以降」, 「Claude Code v2.1.225 以降」, 「VS Code 1.96+」.
 *
 * These are monotonic — `Git 2.23 以降で使えます` stays true when Git ships 2.50 —
 * so a high-confidence claim is a false positive a human has to dismiss on every
 * run. #48 and #63 both reported the same three lines for this reason. Dropping
 * them to `low` keeps them out of the default report.
 *
 * 「以上」 is deliberately NOT here even though #63 listed it. Japanese technical
 * writing uses 以降 for availability but 以上 for a *requirement* — 「Node.js 18 以上
 * (LTS 推奨)」 in `02-getting-started.md` states Claude Code's minimum, and that
 * goes stale the moment the minimum is raised to 20. The whole corpus splits
 * cleanly along this line, so keeping 以上 at high confidence preserves a real
 * compatibility signal while still killing the recurring false positives.
 *
 * The `+` marker must be adjacent: in 「Node.js 18 + npm 9」 the plus joins two
 * requirements rather than meaning "18 or later".
 */
const VERSION_FLOOR_SUFFIX = /^(?:[\s\u3000]*(?:以降|以後)|\+)/;

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

function escapeRegExp(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * True when `url` on `line` is a markdown image or an HTML `<img>` that will
 * actually render — as opposed to a throwaway example link in prose.
 *
 * The URL must be the image destination itself (`![...](url)` / `src="url"`).
 * Sharing a line with some other image is not enough.
 */
export function isDisplayedImageUrl(line: string, url: string): boolean {
  if (!line.includes(url)) return false;
  const escaped = escapeRegExp(url);
  if (new RegExp(`!\\[[^\\]]*\\]\\(${escaped}`).test(line)) return true;
  if (new RegExp(`<img\\b[^>]*\\bsrc\\s*=\\s*(['"])${escaped}\\1`, "i").test(line)) return true;
  if (new RegExp(`<img\\b[^>]*\\bsrc\\s*=\\s*${escaped}(?=[\\s>])`, "i").test(line)) return true;
  return false;
}

/** True when a URL is a real external reference worth checking, not an example. */
export function isCheckableUrl(url: string, line = ""): boolean {
  const host = urlHost(url);
  if (!host) return false;
  if (EXCLUDED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) return false;
  if (OWN_HOSTS.has(host)) return false;
  if (PLACEHOLDER_URL_PATTERN.test(url)) return false;
  if (EXCLUDED_HOSTS.has(host)) {
    return PLACEHOLDER_IMAGE_HOSTS.has(host) && isDisplayedImageUrl(line, url);
  }
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
      if (isCheckableUrl(url, text)) {
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

const FLOOR_NOTE =
  "「以降 / 以後 / +」を伴う下限表記。その版以降で使えるという記述はバージョンが上がっても偽にならない";

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
      const end = a.index + a[0].length;
      claimed.push([a.index, end]);
      const isFloor = VERSION_FLOOR_SUFFIX.test(text.slice(end));
      claims.push({
        kind: "version",
        value: a[0],
        line: lineNo,
        context: text.trim(),
        confidence: isFloor ? "low" : "high",
        note: isFloor ? FLOOR_NOTE : undefined,
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
          note: VERSION_FLOOR_SUFFIX.test(text.slice(end))
            ? FLOOR_NOTE
            : "製品名辞書に無い語。バージョン記述かどうかは要判断",
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
    // 「執筆時点」 contains 「時点」, and 「最新版」 contains 「最新」; without this,
    // one assertion yields two claims with two different fingerprints, so
    // suppressing it would need two ignore entries.
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
      // 「最新」 sits inside the already-claimed 「最新版」/「最新モデル」/「最新のバージョン」
      // — without checking takenSpans, one assertion yields both a high- and a
      // low-confidence claim with two fingerprints, and ignoring the visible
      // high-confidence one leaves the low-confidence duplicate unsuppressed.
      const at = text.indexOf(word);
      const overlapsStrong =
        at !== -1 && takenSpans.some(([s, e]) => at < e && at + word.length > s);
      if (at !== -1 && !overlapsStrong && paragraphHasAnchor(lineNo)) {
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
