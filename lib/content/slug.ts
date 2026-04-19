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
 * Returns the raw slug from a content file/directory name (with `.md` stripped).
 * The leading `NN-` prefix is preserved — used internally for sorting and
 * filesystem lookups, not for URL composition.
 */
export function fileNameToSlug(fileName: string): string {
  return fileName.replace(/\.md$/, "");
}

/**
 * Returns the URL-facing slug for a lecture or detail file/directory name.
 * The leading `NN-` prefix is stripped so URLs read cleanly
 * (e.g. `/themes/01-web-basics/02-git/intro-basics/what-is-git`).
 *
 * Theme and module segments keep their `NN-` prefix and should NOT use this
 * helper.
 */
export function toUrlSlug(fileName: string): string {
  return stripOrderPrefix(fileName);
}
