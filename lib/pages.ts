import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";

const PAGES_DIR = path.join(process.cwd(), "content", "pages");

/**
 * Reads a single-file Markdown page from `content/pages/`. Used for static
 * pages like About / Privacy that do not belong to any theme.
 *
 * Returns `null` when the file is missing so the caller can render `notFound()`.
 */
export const loadStaticPage = cache((slug: string): string | null => {
  try {
    const filePath = path.join(PAGES_DIR, `${slug}.md`);
    return readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
});
