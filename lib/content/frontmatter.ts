import matter from "gray-matter";
import { type LessonFrontmatter, lessonFrontmatterSchema } from "./schema";

export interface ParsedLesson {
  frontmatter: LessonFrontmatter;
  body: string;
}

/**
 * Parse a Markdown source with YAML frontmatter and validate it against the
 * lesson schema. Throws a descriptive error when validation fails so that the
 * build aborts on malformed content.
 */
export function parseLessonSource(source: string, filePath: string): ParsedLesson {
  const parsed = matter(source);
  const result = lessonFrontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in ${filePath}\n${issues}`);
  }
  return { frontmatter: result.data, body: parsed.content };
}
