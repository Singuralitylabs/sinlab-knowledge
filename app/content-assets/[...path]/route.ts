import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const CONTENT_THEMES_DIR = path.resolve(path.join(process.cwd(), "content", "themes"));

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

function notFound(): NextResponse {
  return new NextResponse(null, { status: 404 });
}

/**
 * Serve static assets that live next to Markdown under `content/themes/`.
 * URL `/content-assets/<theme>/<module>/images/foo.png` maps to
 * `content/themes/<theme>/<module>/images/foo.png`.
 *
 * Path segments are validated and the resolved path is verified to stay
 * inside `content/themes/` to prevent traversal outside the content root.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  if (!segments?.length) return notFound();
  for (const seg of segments) {
    if (!seg || seg === "." || seg === ".." || seg.includes("\0") || seg.includes("/")) {
      return notFound();
    }
  }

  const ext = path.extname(segments[segments.length - 1]).toLowerCase();
  const contentType = MIME_BY_EXT[ext];
  if (!contentType) return notFound();

  const resolved = path.resolve(path.join(CONTENT_THEMES_DIR, ...segments));
  if (resolved !== CONTENT_THEMES_DIR && !resolved.startsWith(`${CONTENT_THEMES_DIR}${path.sep}`)) {
    return notFound();
  }

  try {
    const fileStat = await stat(resolved);
    if (!fileStat.isFile()) return notFound();
    const data = await readFile(resolved);
    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        "content-type": contentType,
        "content-length": String(fileStat.size),
        "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch {
    return notFound();
  }
}
