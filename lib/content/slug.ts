/**
 * Strip the leading `NN-` numeric prefix from a directory or file name.
 * Examples:
 *   "01-markdown" -> "markdown"
 *   "02-headings.md" -> "headings"
 *   "no-prefix.md" -> "no-prefix"
 */
export function stripOrderPrefix(name: string): string {
  const base = name.replace(/\.md$/, "");
  return base.replace(/^\d+-/, "");
}

/**
 * Extract the numeric order prefix from a directory or file name.
 * Returns `null` when no prefix exists.
 */
export function extractOrderPrefix(name: string): number | null {
  const match = name.match(/^(\d+)-/);
  return match ? Number.parseInt(match[1], 10) : null;
}

/**
 * Returns the slug used in URLs from a content file/directory name.
 * The leading `NN-` prefix is preserved so that URLs encode order
 * (e.g. `/themes/01-web-basics/01-markdown/02-headings`).
 */
export function fileNameToSlug(fileName: string): string {
  return fileName.replace(/\.md$/, "");
}
