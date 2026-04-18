import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { type Site, siteSchema } from "./content/schema";

const SITE_JSON_PATH = path.join(process.cwd(), "content", "_site.json");

export const getSite = cache((): Site => {
  const raw = readFileSync(SITE_JSON_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  const result = siteSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid content/_site.json\n${issues}`);
  }
  return result.data;
});
