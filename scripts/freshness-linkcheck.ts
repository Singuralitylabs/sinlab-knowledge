/**
 * Stage 2 of the content freshness pipeline: deterministic link resolution.
 * Costs no tokens.
 *
 * Reads the JSON produced by `freshness-scan.ts`, resolves every external URL in
 * it over HTTP, and classifies each one. Handing these URLs to the LLM stage
 * instead would pull whole page bodies into context and expose a session holding
 * repository write access to untrusted external content.
 *
 * Run with:
 *   bun scripts/freshness-scan.ts --all --out=scan.json
 *   bun scripts/freshness-linkcheck.ts --in=scan.json
 *
 *   --in=<path>       Scan JSON (default: stdin)
 *   --out=<path>      Write results to a file instead of stdout
 *   --format=json|markdown
 *   --concurrency=N   Parallel requests (default 6)
 *   --timeout=N       Per-request timeout in ms (default 10000)
 *
 * Exits 0 even when links are dead: this is a report, not a gate. A broken
 * external site must never turn CI red.
 *
 * Network environment matters, and results are not portable between environments:
 *
 *   - In a sandbox that forces traffic through an HTTP CONNECT proxy, Bun's
 *     `fetch` does not honor `HTTPS_PROXY`. This script then falls back to
 *     `curl`, which does. If almost every URL still comes back `unknown`,
 *     the environment (allowlist / proxy) is the suspect, not the links.
 *   - A Claude Cloud Routine enforces its allowlist at the gateway instead, so
 *     `fetch` connects directly — but any host missing from the environment's
 *     **Allowed domains** is refused with 403 and lands in `unknown` too.
 *
 * If a run reports everything as `unknown`, suspect the network policy before
 * suspecting the links. See `docs/04-content-freshness.md`.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { checkUrls, highUnknownWarning, type UrlEntry } from "../lib/content/freshness/linkcheck";
import { selectFetchFn } from "../lib/content/freshness/proxy-fetch";
import type { LinkResult, ScanResult } from "../lib/content/freshness/types";

/**
 * Parse a positive integer strictly. `Number.parseInt` silently truncates
 * `"1x"` to `1` and `"4.5"` to `4`, so a typo in `--concurrency`/`--timeout`
 * passes validation and produces a working-looking but wrong run.
 */
function parseStrictPositiveInt(flag: string, value: string): number {
  if (!/^\d+$/.test(value)) {
    throw new Error(`${flag} は正の整数で指定してください（受け取った値: ${value}）`);
  }
  const n = Number.parseInt(value, 10);
  if (n < 1) throw new Error(`${flag} は 1 以上の整数で指定してください`);
  return n;
}

interface Options {
  in?: string;
  out?: string;
  format: "json" | "markdown";
  concurrency?: number;
  timeoutMs?: number;
}

function parseArgs(argv: string[]): Options {
  const options: Options = { format: "json" };

  for (const arg of argv) {
    const [key, value] = arg.split("=");
    switch (key) {
      case "--in":
        options.in = value;
        break;
      case "--out":
        options.out = value;
        break;
      case "--format":
        if (value !== "json" && value !== "markdown") {
          throw new Error(
            `--format は json か markdown を指定してください（受け取った値: ${value}）`,
          );
        }
        options.format = value;
        break;
      case "--concurrency":
        options.concurrency = parseStrictPositiveInt("--concurrency", value);
        break;
      case "--timeout":
        options.timeoutMs = parseStrictPositiveInt("--timeout", value);
        break;
      default:
        throw new Error(`不明なオプション: ${arg}`);
    }
  }

  return options;
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf-8");
}

/** Map each URL back to the articles that reference it, for the report. */
function buildEntries(scan: ScanResult): UrlEntry[] {
  const byUrl = new Map<string, Set<string>>();

  for (const lesson of scan.lessons) {
    for (const claim of lesson.claims) {
      if (claim.kind !== "url") continue;
      const files = byUrl.get(claim.value) ?? new Set<string>();
      files.add(lesson.file);
      byUrl.set(claim.value, files);
    }
  }

  return scan.urls.map((url) => ({ url, files: [...(byUrl.get(url) ?? [])].sort() }));
}

function formatMarkdown(results: readonly LinkResult[]): string {
  const counts = {
    alive: results.filter((r) => r.status === "alive").length,
    dead: results.filter((r) => r.status === "dead").length,
    moved: results.filter((r) => r.status === "moved").length,
    unknown: results.filter((r) => r.status === "unknown").length,
  };

  const lines = [
    "# 外部リンクの生存確認",
    "",
    `- 到達 ${counts.alive} / 切れ ${counts.dead} / リダイレクト ${counts.moved} / 判定不能 ${counts.unknown}`,
    "",
  ];

  const section = (title: string, status: LinkResult["status"], note?: string): void => {
    const subset = results.filter((r) => r.status === status);
    if (subset.length === 0) return;
    lines.push(`## ${title}`, "");
    if (note) lines.push(note, "");
    for (const r of subset) {
      lines.push(`- ${r.url}${r.finalUrl ? ` → ${r.finalUrl}` : ""} — ${r.reason}`);
      for (const f of r.files) lines.push(`  - \`${f}\``);
    }
    lines.push("");
  };

  section("切れているリンク", "dead");
  section("リダイレクトされたリンク", "moved", "リンク先の内容が変わっていないか要確認。");
  section(
    "判定できなかったリンク",
    "unknown",
    "403 / 429 / タイムアウトなど。ボット対策やレート制限で起きるため、**切れているとは限らない**。",
  );

  return lines.join("\n");
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const source = options.in ? readFileSync(options.in, "utf-8") : await readStdin();
  const scan = JSON.parse(source) as ScanResult;

  const entries = buildEntries(scan);
  if (entries.length === 0) {
    console.error("チェック対象の URL がありません。");
  }

  const { fetchFn, via } = selectFetchFn({});
  if (via === "curl") {
    console.error("プロキシ環境変数を検出したため、Bun の fetch ではなく curl でチェックします。");
  }

  const results = await checkUrls(entries, {
    concurrency: options.concurrency,
    timeoutMs: options.timeoutMs,
    fetchFn,
  });

  const output =
    options.format === "markdown" ? formatMarkdown(results) : JSON.stringify(results, null, 2);

  if (options.out) {
    writeFileSync(options.out, `${output}\n`, "utf-8");
  } else {
    console.log(output);
  }

  const dead = results.filter((r) => r.status === "dead").length;
  const unknown = results.filter((r) => r.status === "unknown").length;
  console.error(`✓ ${results.length} 件を確認 — 切れ ${dead} 件 / 判定不能 ${unknown} 件`);
  const warning = highUnknownWarning(results);
  if (warning) console.error(`⚠ ${warning}`);
}

try {
  await main();
} catch (error) {
  console.error(`✘ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
