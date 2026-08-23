/**
 * Deterministic external link checking.
 *
 * Done here rather than by handing URLs to the LLM stage for two reasons:
 * it costs no tokens (159 URLs fetched through an LLM would pull every page body
 * into context), and it keeps untrusted external page content away from a session
 * that holds repository and issue write access.
 */

import type { LinkResult, LinkStatus } from "./types";

export type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

export interface CheckOptions {
  fetchFn?: FetchFn;
  timeoutMs?: number;
  /** Retries for transient failures (5xx, network errors). */
  retries?: number;
  /** Parallel requests across all hosts. */
  concurrency?: number;
  /** Minimum gap between two requests to the same host, to avoid tripping rate limits. */
  perHostDelayMs?: number;
  userAgent?: string;
}

const DEFAULTS = {
  timeoutMs: 10_000,
  retries: 2,
  concurrency: 6,
  perHostDelayMs: 200,
  // Several hosts (github.com among them) answer 403 to requests with no User-Agent.
  userAgent:
    "Mozilla/5.0 (compatible; sinlab-knowledge-freshness-bot/1.0; +https://github.com/Singuralitylabs/sinlab-knowledge)",
} as const;

/**
 * Statuses where a HEAD request tells us nothing and a GET is worth trying.
 *
 * 404 is included deliberately: some hosts answer 404 to HEAD while serving the
 * page fine over GET. Since a confirmed `dead` link opens its own issue, paying
 * one extra request to avoid that false positive is the right trade — and real
 * 404s are rare enough that the cost is negligible.
 */
const HEAD_UNSUPPORTED = new Set([403, 404, 405, 501]);

/** Compare URLs ignoring differences that carry no meaning for a reader. */
function canonicalize(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.hostname = parsed.hostname.toLowerCase();
    if (parsed.pathname.length > 1) parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Map an HTTP outcome onto a {@link LinkStatus}.
 *
 * The important rule: **403 and 429 are never `dead`.** Cloudflare bot protection
 * and rate limiting produce both routinely, and reporting them as broken links
 * would fill the issue with false positives that erode trust in the whole report.
 */
export function classifyStatus(
  requestedUrl: string,
  httpStatus: number,
  finalUrl: string,
): { status: LinkStatus; reason: string } {
  if (httpStatus === 404 || httpStatus === 410) {
    return { status: "dead", reason: `HTTP ${httpStatus}` };
  }
  if (httpStatus === 403 || httpStatus === 429) {
    return { status: "unknown", reason: `HTTP ${httpStatus}（ボット対策やレート制限の可能性）` };
  }
  if (httpStatus >= 500) {
    return { status: "unknown", reason: `HTTP ${httpStatus}（サーバ側の一時障害の可能性）` };
  }
  if (httpStatus >= 400) {
    return { status: "unknown", reason: `HTTP ${httpStatus}` };
  }
  if (canonicalize(finalUrl) !== canonicalize(requestedUrl)) {
    return { status: "moved", reason: `HTTP ${httpStatus} — 別 URL にリダイレクトされた` };
  }
  return { status: "alive", reason: `HTTP ${httpStatus}` };
}

/** Share of results classified `unknown`. Empty input is 0, not NaN. */
export function unknownShare(results: readonly { status: string }[]): number {
  if (results.length === 0) return 0;
  return results.filter((r) => r.status === "unknown").length / results.length;
}

/**
 * Warn when almost every URL came back `unknown`. That pattern is the
 * environment (proxy / allowlist), not the links — see docs/04-content-freshness.md.
 */
export const HIGH_UNKNOWN_SHARE = 0.8;

export function highUnknownWarning(results: readonly { status: string }[]): string | null {
  const share = unknownShare(results);
  if (results.length === 0 || share < HIGH_UNKNOWN_SHARE) return null;
  const unknown = results.filter((r) => r.status === "unknown").length;
  const percent = Math.round(share * 100);
  return (
    `判定不能が ${unknown}/${results.length} 件（${percent}%）です。` +
    "リンク切れではなく、実行環境のネットワーク（プロキシ未対応・許可リスト漏れ）を疑ってください。"
  );
}

interface Attempt {
  httpStatus: number;
  finalUrl: string;
}

async function requestOnce(
  url: string,
  method: "HEAD" | "GET",
  opts: Required<Pick<CheckOptions, "fetchFn" | "timeoutMs" | "userAgent">>,
): Promise<Attempt> {
  const headers: Record<string, string> = { "user-agent": opts.userAgent };
  // Ask for a single byte so a GET fallback doesn't download whole pages.
  if (method === "GET") headers.range = "bytes=0-0";

  const response = await opts.fetchFn(url, {
    method,
    headers,
    redirect: "follow",
    signal: AbortSignal.timeout(opts.timeoutMs),
  });

  return { httpStatus: response.status, finalUrl: response.url || url };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Resolve one URL: HEAD, fall back to GET, retry transient failures. */
export async function checkUrl(
  url: string,
  files: string[] = [],
  options: CheckOptions = {},
): Promise<LinkResult> {
  const opts = {
    fetchFn: options.fetchFn ?? ((u: string, init: RequestInit) => fetch(u, init)),
    timeoutMs: options.timeoutMs ?? DEFAULTS.timeoutMs,
    userAgent: options.userAgent ?? DEFAULTS.userAgent,
  };
  const retries = options.retries ?? DEFAULTS.retries;

  let lastError = "不明なエラー";

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      let result = await requestOnce(url, "HEAD", opts);
      if (HEAD_UNSUPPORTED.has(result.httpStatus)) {
        result = await requestOnce(url, "GET", opts);
      }

      const classified = classifyStatus(url, result.httpStatus, result.finalUrl);
      // Only server-side flakiness is worth another round trip.
      if (result.httpStatus >= 500 && attempt < retries) {
        lastError = classified.reason;
        await sleep(2 ** attempt * 500);
        continue;
      }

      return {
        url,
        status: classified.status,
        httpStatus: result.httpStatus,
        finalUrl: canonicalize(result.finalUrl) === canonicalize(url) ? null : result.finalUrl,
        reason: classified.reason,
        files,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      if (attempt < retries) await sleep(2 ** attempt * 500);
    }
  }

  return {
    url,
    status: "unknown",
    httpStatus: null,
    finalUrl: null,
    reason: `リクエスト失敗: ${lastError}`,
    files,
  };
}

export interface UrlEntry {
  url: string;
  files: string[];
}

/**
 * Check many URLs with bounded parallelism and per-host spacing.
 *
 * Results come back in input order regardless of completion order.
 */
export async function checkUrls(
  entries: readonly UrlEntry[],
  options: CheckOptions = {},
): Promise<LinkResult[]> {
  const concurrency = options.concurrency ?? DEFAULTS.concurrency;
  const perHostDelayMs = options.perHostDelayMs ?? DEFAULTS.perHostDelayMs;

  // A concurrency of 0 starts zero workers, so `results` stays a sparse array
  // of `undefined` — silently wrong rather than an obvious failure.
  if (concurrency < 1) {
    throw new Error(`concurrency must be >= 1 (got ${concurrency})`);
  }

  const results: LinkResult[] = new Array(entries.length);
  const lastHitByHost = new Map<string, number>();
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < entries.length) {
      const index = cursor++;
      const entry = entries[index];

      let host: string;
      try {
        host = new URL(entry.url).hostname;
      } catch {
        host = entry.url;
      }

      // Reserve this host's next slot *before* sleeping. Reading the timestamp
      // and writing it after waking lets every worker queued on the same host
      // compute the same delay and wake together, which bursts the host and
      // defeats the rate limiting these delays exist to avoid.
      const earliest = Math.max(Date.now(), lastHitByHost.get(host) ?? 0);
      lastHitByHost.set(host, earliest + perHostDelayMs);
      const wait = earliest - Date.now();
      if (wait > 0) await sleep(wait);

      results[index] = await checkUrl(entry.url, entry.files, options);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, worker));
  return results;
}
