import type { LessonFrontmatter } from "../../../lib/content/schema";

/**
 * Render a LessonFrontmatter object as a YAML frontmatter block (including the
 * surrounding `---` delimiters and trailing newline). The output uses a stable
 * key ordering so re-runs produce identical files.
 *
 * Strings are emitted with proper YAML quoting only when they contain
 * characters that would otherwise need escaping. Arrays are emitted as flow
 * style (`[a, b]`) because all values we use are short identifiers.
 */
export function renderFrontmatter(fm: LessonFrontmatter): string {
  const lines: string[] = ["---"];

  lines.push(`title: ${quoteYamlString(fm.title)}`);
  if (fm.description) {
    lines.push(`description: ${quoteYamlString(fm.description)}`);
  }
  lines.push(`order: ${fm.order}`);
  lines.push(`type: ${fm.type}`);
  if (fm.category) {
    lines.push(`category: ${fm.category}`);
  }
  lines.push(`difficulty: ${fm.difficulty}`);
  lines.push(`tags: ${renderStringArray(fm.tags)}`);
  if (fm.estimatedMinutes !== undefined) {
    lines.push(`estimatedMinutes: ${fm.estimatedMinutes}`);
  }
  lines.push(`status: ${fm.status}`);
  if (fm.publishedAt) {
    lines.push(`publishedAt: ${quoteYamlString(fm.publishedAt)}`);
  }
  if (fm.updatedAt) {
    lines.push(`updatedAt: ${quoteYamlString(fm.updatedAt)}`);
  }
  if (fm.relatedLessons.length > 0) {
    lines.push(`relatedLessons: ${renderStringArray(fm.relatedLessons)}`);
  }
  if (fm.authors.length > 0) {
    lines.push("authors:");
    for (const a of fm.authors) {
      const url = a.url ? `, url: ${quoteYamlString(a.url)}` : "";
      lines.push(`  - { name: ${quoteYamlString(a.name)}${url} }`);
    }
  }

  lines.push("---", "");
  return lines.join("\n");
}

function renderStringArray(values: string[]): string {
  if (values.length === 0) return "[]";
  return `[${values.map((v) => quoteYamlStringIfNeeded(v)).join(", ")}]`;
}

/**
 * Quote a YAML string only when it contains characters that would otherwise be
 * misparsed (e.g. `:`, leading symbols, multi-byte characters that gray-matter
 * normally handles fine, but we err on the safe side for titles and
 * descriptions).
 */
function quoteYamlString(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function quoteYamlStringIfNeeded(value: string): string {
  // For tags / slugs we keep things bare when they look like a plain identifier.
  if (/^[A-Za-z0-9_-]+$/.test(value)) return value;
  return quoteYamlString(value);
}
