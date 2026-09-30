/**
 * Blank out code regions while preserving line numbering.
 *
 * Lines become empty strings rather than being removed, so reported line numbers
 * still match the raw file. See `docs/04-content-freshness.md`.
 */

/** Opening fence: up to 3 spaces of indent, then 3+ backticks or tildes. */
const FENCE_RE = /^ {0,3}(`{3,}|~{3,})/;

/**
 * Closing fence. Per CommonMark a closing fence carries no info string, so
 * ```` ```javascript ```` inside a ```` ```markdown ```` block is content, not a
 * terminator. Without this distinction the Markdown lessons that demonstrate
 * fence syntax close early: prose after the inner fence gets scanned as code and
 * — worse — real headings and paragraphs after it get masked away unscanned.
 */
const CLOSING_FENCE_RE = /^ {0,3}(`{3,}|~{3,})[ \t]*$/;

/** Inline code span. Non-greedy within a single line. */
const INLINE_CODE_RE = /`[^`\n]*`/g;

interface OpenFence {
  char: string;
  length: number;
}

/**
 * Fence matching follows CommonMark: same marker character, at least the same
 * run length, no info string. All three matter because Markdown lessons nest
 * fences. An unterminated fence masks to EOF (safe direction: a missed claim is
 * cheaper than shell output in the report).
 */
export function maskCodeRegions(source: string): string {
  const lines = source.split("\n");
  const out: string[] = new Array(lines.length);
  let fence: OpenFence | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (fence) {
      const closing = CLOSING_FENCE_RE.exec(line);
      if (closing && closing[1][0] === fence.char && closing[1].length >= fence.length) {
        fence = null;
      }
      out[i] = "";
      continue;
    }

    const match = FENCE_RE.exec(line);

    if (match) {
      fence = { char: match[1][0], length: match[1].length };
      out[i] = "";
      continue;
    }

    out[i] = line.replace(INLINE_CODE_RE, "");
  }

  return out.join("\n");
}

/**
 * Paragraph boundaries (blank-line separated) over an already-masked source,
 * as inclusive 1-indexed line ranges.
 *
 * Weak temporal words are only meaningful alongside a year, product version, or
 * URL in the same paragraph, so the extractor needs to know where paragraphs start
 * and end.
 */
export function paragraphRanges(masked: string): { start: number; end: number }[] {
  const lines = masked.split("\n");
  const ranges: { start: number; end: number }[] = [];
  let start: number | null = null;

  for (let i = 0; i < lines.length; i++) {
    const blank = lines[i].trim() === "";
    if (blank) {
      if (start !== null) {
        ranges.push({ start: start + 1, end: i });
        start = null;
      }
    } else if (start === null) {
      start = i;
    }
  }

  if (start !== null) ranges.push({ start: start + 1, end: lines.length });
  return ranges;
}
