/**
 * Proxy-aware HTTP for Stage 2.
 *
 * Bun's `fetch` does not honor `HTTPS_PROXY` / `HTTP_PROXY`. In CONNECT-proxy
 * sandboxes that means every URL comes back `unknown` while `curl` (which does
 * honor the proxy) still reaches the hosts. When a proxy env var is set, Stage 2
 * therefore sends requests through `curl` instead of `fetch`.
 */

import type { FetchFn } from "./linkcheck";

export function resolveProxyUrl(env: NodeJS.Dict<string> = process.env): string | undefined {
  return (
    env.HTTPS_PROXY ||
    env.https_proxy ||
    env.HTTP_PROXY ||
    env.http_proxy ||
    env.ALL_PROXY ||
    env.all_proxy ||
    undefined
  );
}

/** Parse `curl -w "%{http_code} %{url_effective}"` stdout. */
export function parseCurlWriteOut(stdout: string): { httpStatus: number; finalUrl: string } {
  const trimmed = stdout.trim();
  const space = trimmed.indexOf(" ");
  if (space === -1) {
    throw new Error(`curl の出力を解釈できません: ${trimmed}`);
  }
  const httpStatus = Number.parseInt(trimmed.slice(0, space), 10);
  if (!Number.isFinite(httpStatus)) {
    throw new Error(`curl の HTTP ステータスを解釈できません: ${trimmed}`);
  }
  return { httpStatus, finalUrl: trimmed.slice(space + 1).trim() };
}

function headerValue(headers: HeadersInit | undefined, name: string): string | undefined {
  if (!headers) return undefined;
  if (headers instanceof Headers) return headers.get(name) ?? undefined;
  if (Array.isArray(headers)) {
    const found = headers.find(([key]) => key.toLowerCase() === name.toLowerCase());
    return found?.[1];
  }
  const record = headers as Record<string, string>;
  const key = Object.keys(record).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? record[key] : undefined;
}

/**
 * Build the `curl` argv. HEAD uses `-I` rather than `-X HEAD`: curl's own
 * manual says `-X HEAD` only changes the verb and still waits for a body,
 * which hangs on keep-alive responses until the abort timeout.
 */
export function buildCurlArgs(url: string, init: RequestInit): string[] {
  const method = (init.method ?? "GET").toUpperCase();
  const userAgent = headerValue(init.headers, "user-agent");
  const range = headerValue(init.headers, "range");

  const args = [
    "curl",
    "-sS",
    "-o",
    "/dev/null",
    "-w",
    "%{http_code} %{url_effective}",
    "-L",
    "--max-redirs",
    "10",
    "--max-time",
    "120",
  ];
  if (method === "HEAD") {
    args.push("-I");
  } else {
    args.push("-X", method);
  }
  if (userAgent) args.push("-A", userAgent);
  if (range) args.push("-H", `Range: ${range}`);
  args.push("--", url);
  return args;
}

/**
 * `fetch`-compatible wrapper around `curl`. Honors `HTTPS_PROXY` via curl's
 * own environment handling. The URL is passed as a separate argv entry so it
 * cannot be interpreted as extra curl flags.
 */
export const curlFetch: FetchFn = async (url, init) => {
  const args = buildCurlArgs(url, init);

  const proc = Bun.spawn(args, { stdout: "pipe", stderr: "pipe" });

  const onAbort = (): void => {
    proc.kill();
  };
  init.signal?.addEventListener("abort", onAbort, { once: true });

  try {
    const [stdout, stderr, exitCode] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
      proc.exited,
    ]);

    if (exitCode !== 0) {
      const detail = stderr.trim() || stdout.trim() || `exit ${exitCode}`;
      throw new Error(`curl が失敗しました: ${detail}`);
    }

    const parsed = parseCurlWriteOut(stdout);
    return { status: parsed.httpStatus, url: parsed.finalUrl || url } as Response;
  } finally {
    init.signal?.removeEventListener("abort", onAbort);
  }
};

export function selectFetchFn(options: { fetchFn?: FetchFn; env?: NodeJS.Dict<string> }): {
  fetchFn: FetchFn;
  via: "inject" | "curl" | "native";
} {
  if (options.fetchFn) return { fetchFn: options.fetchFn, via: "inject" };
  if (resolveProxyUrl(options.env)) return { fetchFn: curlFetch, via: "curl" };
  return { fetchFn: (u, init) => fetch(u, init), via: "native" };
}
