import { z } from "zod";

export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
export type Difficulty = z.infer<typeof difficultySchema>;

export const statusSchema = z.enum(["draft", "published", "deprecated"]);
export type Status = z.infer<typeof statusSchema>;

/**
 * Lesson types used in frontmatter.
 * - `lecture`: main reading content shown in module TOC (file-type or directory-type with `index.md`)
 * - `detail`: deep-dive sub-page placed under a directory-type lecture
 * - `cheatsheet`: quick-lookup reference (rarely used standalone)
 * - `reference` (legacy): kept for backwards compat during migration; treat like `detail`
 */
export const lessonTypeSchema = z.enum(["lecture", "detail", "reference", "cheatsheet"]);
export type LessonType = z.infer<typeof lessonTypeSchema>;

export const navItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const siteSchema = z.object({
  title: z.string(),
  description: z.string(),
  siteUrl: z.string().url(),
  author: z.string(),
  navigation: z.array(navItemSchema),
  footer: z
    .object({
      links: z.array(navItemSchema).default([]),
    })
    .default({ links: [] }),
});
export type Site = z.infer<typeof siteSchema>;

export const themeMetaSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortTitle: z.string().optional(),
  description: z.string(),
  icon: z.string().optional(),
  color: z.string(),
  order: z.number(),
  difficulty: difficultySchema,
  estimatedHours: z.number().optional(),
  status: statusSchema.default("published"),
});
export type ThemeMeta = z.infer<typeof themeMetaSchema>;

export const moduleCategorySchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string().optional(),
});
export type ModuleCategory = z.infer<typeof moduleCategorySchema>;

export const moduleMetaSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  order: z.number(),
  categories: z.array(moduleCategorySchema).default([]),
  status: statusSchema.default("published"),
});
export type ModuleMeta = z.infer<typeof moduleMetaSchema>;

export const authorSchema = z.object({
  name: z.string(),
  url: z.string().url().optional(),
});

export const lessonFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  order: z.number(),
  type: lessonTypeSchema,
  category: z.string().optional(),
  difficulty: difficultySchema,
  tags: z.array(z.string()).default([]),
  estimatedMinutes: z.number().optional(),
  status: statusSchema.default("published"),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  relatedLessons: z.array(z.string()).default([]),
  authors: z.array(authorSchema).default([]),
});
export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>;
