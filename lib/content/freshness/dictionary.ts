/**
 * Vocabulary tables for the freshness scanner.
 *
 * These are deliberately hard-coded: the CLAUDE.md rule against hard-coded lists
 * is about **lesson/module/theme listings**, which must stay derived from
 * `content/`. This file describes the *outside world* (product names, throwaway
 * example domains), which `content/` cannot tell us about.
 */

/**
 * Hosts that only ever appear as throwaway examples. Matched exactly.
 *
 * Most example URLs already live inside code fences and are removed by
 * `maskCodeRegions` before extraction; this list catches the ones written in prose.
 */
export const EXCLUDED_HOSTS: ReadonlySet<string> = new Set([
  "example.com",
  "www.example.com",
  "api.example.com",
  "example.org",
  "example.net",
  "localhost",
  "127.0.0.1",
  "via.placeholder.com",
  "placehold.co",
  "jsonplaceholder.typicode.com",
  "img.shields.io",
  "shields.io",
  "username.github.io",
  "user.github.io",
  "yourname.github.io",
]);

/** Host suffixes that mark a non-routable or reserved name. */
export const EXCLUDED_HOST_SUFFIXES: readonly string[] = [
  ".example.com",
  ".local",
  ".test",
  ".invalid",
  ".localhost",
];

/**
 * URLs containing an obvious placeholder token. Catches things like
 * `https://github.com/your-name/repo` that survive host-level filtering.
 *
 * `your` / `example` alone are too broad: a real Anthropic help-center URL is
 * `.../set-up-your-design-system-...`, and `\byour[-_]?` matches it — silently
 * dropping a live link from stage 2. Require the placeholder shape itself
 * (`your-name`, `yourname`, `example-foo`), not just the word.
 */
export const PLACEHOLDER_URL_PATTERN =
  /(?:\byour[-_](?:name|username|repo|org|account)\b|\byourname\b|\bUSERNAME\b|<[^>]+>|\{\{|\bexample-(?:repo|org|user)\b|\bmy-repo\b)/i;

/**
 * Our own site. These resolve to pages this repository builds, so external
 * liveness checking is meaningless for them.
 */
export const OWN_HOSTS: ReadonlySet<string> = new Set([
  "sinlab.future-tech-association.org",
  "sinlab-skills.vercel.app",
]);

/**
 * Domains whose *numbers* go stale even while the URL keeps returning 200 —
 * model leaderboards, benchmark scores, capability tables. A live link here is
 * not evidence the surrounding prose is still accurate.
 */
export const HIGH_RISK_HOSTS: ReadonlySet<string> = new Set([
  "artificialanalysis.ai",
  "epoch.ai",
  "www.swebench.com",
  "swebench.com",
  "wandb.ai",
  "lmarena.ai",
  "mmmu-benchmark.github.io",
  "paperswithcode.com",
]);

/**
 * Product names for Tier A version detection. A match here plus a version-like
 * number is reported with high confidence.
 *
 * Sorted longest-first at regex build time so `Visual Studio Code` wins over `Code`.
 */
export const PRODUCT_NAMES: readonly string[] = [
  // Runtimes & languages
  "Node.js",
  "Node",
  "Bun",
  "Deno",
  "TypeScript",
  "JavaScript",
  "Python",
  "Ruby",
  "Rust",
  "PHP",
  "Java",
  // Frameworks & libraries
  "Next.js",
  "React",
  "Vue",
  "Angular",
  "Svelte",
  "Express",
  "Tailwind CSS",
  "TailwindCSS",
  "Zod",
  "Vite",
  "Webpack",
  "ESLint",
  "Prettier",
  "Biome",
  "Shiki",
  // Tooling
  "Git",
  "GitHub CLI",
  "npm",
  "pnpm",
  "Yarn",
  "Docker",
  "Visual Studio Code",
  "VS Code",
  // Data stores
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "Redis",
  "Supabase",
  // Platforms
  "Ubuntu",
  "Debian",
  "macOS",
  "Windows",
  "Chrome",
  "Firefox",
  "Safari",
  // AI models & tools
  "Claude Code",
  "Claude",
  "Opus",
  "Sonnet",
  "Haiku",
  "GPT",
  "Gemini",
  "Llama",
  "Mistral",
];

/**
 * Capitalised words that take a trailing number without being a product version.
 * Used to suppress Tier B false positives such as `CVSS 7.1` and `MMLU 92`.
 */
export const VERSION_STOPWORDS: ReadonlySet<string> = new Set([
  "Top",
  "Level",
  "Step",
  "Part",
  "Chapter",
  "Phase",
  "Section",
  "Day",
  "Week",
  "Month",
  "Year",
  "Case",
  "Pattern",
  "Figure",
  "Fig",
  "Table",
  "Hue",
  "No",
  "Q",
  "Example",
  "Type",
  "Total",
  "Note",
  "Rev",
  "Column",
  "Row",
  "Line",
  "Page",
  "Item",
  "Option",
  "Rule",
  "Tier",
  // Benchmark and scoring vocabulary
  "CVSS",
  "MMLU",
  "ARC",
  "GPQA",
  "HumanEval",
  "SWE",
  "Elo",
  "Score",
]);

/** Strong Japanese phrases that assert a point-in-time fact on their own. */
export const STRONG_TEMPORAL_PHRASES: readonly string[] = [
  "現時点",
  "執筆時点",
  "本記事執筆",
  "時点で",
  "最新版",
  "最新のバージョン",
  "最新モデル",
];

/**
 * Weak temporal words. Bare 「現在」 appears ~101 times across 71 files in this
 * repository, usually meaning "is in the state of" rather than "as of today", so
 * these only count when their paragraph also carries a year, product version, or URL.
 */
export const WEAK_TEMPORAL_WORDS: readonly string[] = [
  "現在",
  "最新",
  "最近",
  "近年",
  "今後",
  "当面",
];

/** Body length below which an article is a placeholder rather than real content. */
export const STUB_BODY_CHARS = 500;

function escapeRegExp(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Tier A: a known product name followed by a version-like number.
 *
 * Requires an ASCII product name, so Japanese text such as 「第3章」 or
 * 「2 スペース」 cannot match — the common false positives are excluded by
 * construction rather than by a blocklist.
 */
export function buildProductVersionPattern(): RegExp {
  const alternation = [...PRODUCT_NAMES]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");
  return new RegExp(`\\b(?:${alternation})\\s*v?\\d+(?:\\.\\d+){0,2}\\b`, "g");
}

/**
 * Tier B: any capitalised token followed by a **dotted** version.
 *
 * Requiring at least one dot is what removes `Top 10`, `Level 1`, `Step 3`, and
 * `Hue 0`; the remaining offenders are handled by {@link VERSION_STOPWORDS}.
 */
export const GENERIC_VERSION_PATTERN = /\b([A-Z][A-Za-z0-9.+#_-]{1,20})\s+v?(\d+(?:\.\d+){1,2})\b/g;
