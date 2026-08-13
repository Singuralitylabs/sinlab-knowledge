/**
 * Fingerprinting and report formatting.
 *
 * The rotation carries no state file, which means the scanner cannot remember
 * that a finding was already triaged — the same false positive would resurface
 * every n weeks forever. Fingerprints close that gap by making the suppression
 * list a reviewable file in `content/` rather than machine-written state: git
 * history then records *why* each finding was dismissed.
 */

import { createHash } from "node:crypto";
import type { Claim, InternalLinkIssue, LessonScan, LinkResult, ScanResult } from "./types";

/** Stable short identifier for a claim, used by `content/.freshness-ignore`. */
export function fingerprint(file: string, value: string): string {
  return createHash("sha1").update(`${file}:${value}`).digest("hex").slice(0, 8);
}

/**
 * Parse `content/.freshness-ignore`.
 *
 * One fingerprint per line. Everything after `#` is a comment, and blank lines
 * are ignored, so each entry can carry its reason inline.
 */
export function parseIgnoreList(source: string): Set<string> {
  const entries = new Set<string>();
  for (const line of source.split("\n")) {
    const withoutComment = line.split("#")[0].trim();
    if (withoutComment) entries.add(withoutComment);
  }
  return entries;
}

/** Drop claims whose fingerprint appears in the ignore list. */
export function applyIgnoreList(lessons: LessonScan[], ignored: ReadonlySet<string>): LessonScan[] {
  if (ignored.size === 0) return lessons;
  return lessons.map((lesson) => ({
    ...lesson,
    claims: lesson.claims.filter((c) => !ignored.has(fingerprint(lesson.file, c.value))),
  }));
}

const KIND_LABEL: Record<Claim["kind"], string> = {
  url: "リンク",
  version: "バージョン",
  date: "日付・時点",
};

/**
 * One row per fingerprint, listing every line the claim occurs on.
 *
 * A fingerprint covers a (file, value) pair rather than a single line, so
 * suppressing one occurrence suppresses them all. Emitting one row per
 * occurrence would imply otherwise.
 */
function claimLines(file: string, claims: readonly Claim[]): string[] {
  const grouped = new Map<string, { claim: Claim; lines: number[] }>();

  for (const claim of claims) {
    const id = fingerprint(file, claim.value);
    const entry = grouped.get(id);
    if (entry) {
      entry.lines.push(claim.line);
    } else {
      grouped.set(id, { claim, lines: [claim.line] });
    }
  }

  return [...grouped].map(([id, { claim, lines }]) => {
    const note = claim.note ? ` — ${claim.note}` : "";
    const where =
      lines.length > 3
        ? `L${lines[0]} ほか${lines.length - 1}件`
        : lines.map((l) => `L${l}`).join(", ");
    return `  - \`${id}\` ${where} [${KIND_LABEL[claim.kind]}] \`${claim.value}\`${note}`;
  });
}

function formatInternalIssues(issues: readonly InternalLinkIssue[]): string[] {
  if (issues.length === 0) return [];
  const lines = ["## 内部リンク切れ", ""];
  lines.push("サイト内のページに解決しないリンク。全記事を対象に毎回チェックしている。", "");
  for (const issue of issues) {
    lines.push(`- \`${issue.file}\` L${issue.line} → \`${issue.href}\``);
  }
  lines.push("");
  return lines;
}

function formatLinkResults(results: readonly LinkResult[]): string[] {
  const dead = results.filter((r) => r.status === "dead");
  const moved = results.filter((r) => r.status === "moved");
  const unknown = results.filter((r) => r.status === "unknown");
  if (dead.length + moved.length + unknown.length === 0) return [];

  const lines = ["## 外部リンクの状態", ""];

  if (dead.length > 0) {
    lines.push("### 切れているリンク（404 / 410 / DNS 失敗）", "");
    for (const r of dead) {
      lines.push(`- ${r.url} — ${r.reason}`);
      for (const f of r.files) lines.push(`  - \`${f}\``);
    }
    lines.push("");
  }

  if (moved.length > 0) {
    lines.push("### リダイレクトされたリンク", "");
    lines.push("到達はするが別 URL に移動している。リンク先の内容が変わっていないか要確認。", "");
    for (const r of moved) {
      lines.push(`- ${r.url} → ${r.finalUrl}`);
      for (const f of r.files) lines.push(`  - \`${f}\``);
    }
    lines.push("");
  }

  if (unknown.length > 0) {
    lines.push("### 判定できなかったリンク", "");
    lines.push(
      "403 / 429 / タイムアウトなど。ボット対策やレート制限で起きるため、**切れているとは限らない**。",
      "",
    );
    for (const r of unknown) lines.push(`- ${r.url} — ${r.reason}`);
    lines.push("");
  }

  return lines;
}

export interface FormatOptions {
  /** Include `low` confidence claims. Off by default to keep the report readable. */
  includeLow?: boolean;
  linkResults?: readonly LinkResult[];
}

/** Render a scan (and optional link results) as the Markdown body of the tracking issue. */
export function formatMarkdown(result: ScanResult, options: FormatOptions = {}): string {
  const { includeLow = false, linkResults } = options;
  const lines: string[] = [];

  lines.push("# 記事の陳腐化チェック結果", "");
  lines.push(`- 生成日時: ${result.generatedAt}`);
  lines.push(
    `- 対象: ${
      result.selectedBucket === null
        ? "全候補"
        : `バケット ${result.selectedBucket} / ${result.bucketCount}（週インデックス ${result.weekIndex}）`
    }`,
  );
  lines.push(
    `- 走査 ${result.totals.lessons} 記事 → 候補 ${result.totals.candidates} 件（スタブ ${result.totals.stubs} 件を除外）`,
  );
  lines.push(
    `- 抽出: リンク ${result.totals.urlClaims} 件（ユニーク ${result.totals.uniqueUrls}）/ バージョン ${result.totals.versionClaims} 件 / 日付 ${result.totals.dateClaims} 件`,
  );
  lines.push("");

  if (result.warnings.length > 0) {
    lines.push("> [!WARNING]");
    for (const w of result.warnings) lines.push(`> ${w}`);
    lines.push("");
  }

  lines.push(...formatInternalIssues(result.internalLinkIssues));
  if (linkResults) lines.push(...formatLinkResults(linkResults));

  lines.push("## 今回の精査対象", "");
  if (result.lessons.length === 0) {
    lines.push("該当なし。", "");
  } else {
    lines.push(
      "各行の先頭は fingerprint。誤検出だった場合は `content/.freshness-ignore` に理由付きで追記すると次回から抑制される。",
      "",
    );
    for (const lesson of result.lessons) {
      const claims = lesson.claims.filter((c) => includeLow || c.confidence === "high");
      if (claims.length === 0) continue;
      const flags = [lesson.draft ? "draft" : null, lesson.stub ? "stub" : null]
        .filter(Boolean)
        .join(", ");
      lines.push(`### \`${lesson.file}\`${flags ? ` (${flags})` : ""}`);
      lines.push(`${lesson.title} — スコア ${lesson.score}`, "");
      lines.push(...claimLines(lesson.file, claims));
      lines.push("");
    }
  }

  return lines.join("\n");
}
