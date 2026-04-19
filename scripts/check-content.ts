/**
 * Validate every Markdown file under `content/themes/` against the lesson
 * frontmatter schema. Also verifies that each theme/module has a valid
 * meta JSON. Exits with code 1 on the first batch of failures so CI can
 * gate merges on it.
 *
 * Run with: `bun scripts/check-content.ts`
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { parseLessonSource } from "../lib/content/frontmatter";
import { moduleMetaSchema, siteSchema, themeMetaSchema } from "../lib/content/schema";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const THEMES_DIR = path.join(CONTENT_DIR, "themes");
const SITE_JSON = path.join(CONTENT_DIR, "_site.json");

interface Issue {
  file: string;
  message: string;
}

const issues: Issue[] = [];

function relative(p: string): string {
  return path.relative(ROOT, p);
}

function pushIssue(file: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  issues.push({ file: relative(file), message });
}

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function listDirs(dir: string): string[] {
  try {
    return readdirSync(dir).filter((name) => {
      if (name.startsWith("_") || name.startsWith(".")) return false;
      return statSync(path.join(dir, name)).isDirectory();
    });
  } catch {
    return [];
  }
}

function listMarkdown(dir: string): string[] {
  try {
    return readdirSync(dir).filter((name) => name.endsWith(".md") && !name.startsWith("_"));
  } catch {
    return [];
  }
}

// _site.json -----------------------------------------------------------------
try {
  siteSchema.parse(readJson(SITE_JSON));
} catch (error) {
  pushIssue(SITE_JSON, error);
}

let lectureCount = 0;
let detailCount = 0;
let moduleCount = 0;
let themeCount = 0;

function validateMarkdownFile(filePath: string): void {
  try {
    const source = readFileSync(filePath, "utf-8");
    parseLessonSource(source, filePath);
  } catch (error) {
    pushIssue(filePath, error);
    throw error;
  }
}

for (const themeName of listDirs(THEMES_DIR)) {
  const themeDir = path.join(THEMES_DIR, themeName);
  const themeJson = path.join(themeDir, "_theme.json");

  try {
    themeMetaSchema.parse(readJson(themeJson));
    themeCount++;
  } catch (error) {
    pushIssue(themeJson, error);
    continue;
  }

  for (const moduleName of listDirs(themeDir)) {
    const moduleDir = path.join(themeDir, moduleName);
    const moduleJson = path.join(moduleDir, "_module.json");

    try {
      moduleMetaSchema.parse(readJson(moduleJson));
      moduleCount++;
    } catch (error) {
      pushIssue(moduleJson, error);
      continue;
    }

    const lessonsDir = path.join(moduleDir, "lessons");
    let entries: string[] = [];
    try {
      entries = readdirSync(lessonsDir);
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (entry.startsWith("_") || entry.startsWith(".")) continue;
      const entryPath = path.join(lessonsDir, entry);
      let stat: ReturnType<typeof statSync>;
      try {
        stat = statSync(entryPath);
      } catch {
        continue;
      }

      if (stat.isFile() && entry.endsWith(".md")) {
        // File-type lecture
        try {
          validateMarkdownFile(entryPath);
          lectureCount++;
        } catch {
          /* already recorded */
        }
      } else if (stat.isDirectory()) {
        // Directory-type lecture: index.md + sibling detail files
        const indexPath = path.join(entryPath, "index.md");
        try {
          statSync(indexPath);
          try {
            validateMarkdownFile(indexPath);
            lectureCount++;
          } catch {
            /* already recorded */
          }
        } catch {
          pushIssue(entryPath, "Directory-type lecture is missing required `index.md`");
          continue;
        }

        for (const detailFile of listMarkdown(entryPath)) {
          if (detailFile === "index.md") continue;
          const detailPath = path.join(entryPath, detailFile);
          try {
            validateMarkdownFile(detailPath);
            detailCount++;
          } catch {
            /* already recorded */
          }
        }
      }
    }
  }
}

// Report ---------------------------------------------------------------------

if (issues.length > 0) {
  console.error(
    `\n✘ Content validation failed (${issues.length} issue${issues.length === 1 ? "" : "s"}):\n`,
  );
  for (const issue of issues) {
    console.error(`  ${issue.file}`);
    for (const line of issue.message.split("\n")) {
      console.error(`      ${line}`);
    }
    console.error();
  }
  process.exit(1);
}

console.log(
  `✓ Content OK — ${themeCount} theme(s), ${moduleCount} module(s), ${lectureCount} lecture(s), ${detailCount} detail(s)`,
);
