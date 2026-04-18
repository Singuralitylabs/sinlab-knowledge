import { renderMarkdown } from "../../lib/content/mdx";
import { getSite } from "../../lib/site";
import { getAllLessonPaths, getThemes } from "../../lib/themes";

const site = getSite();
console.log("=== Site ===");
console.log(JSON.stringify(site, null, 2));

console.log("\n=== Themes ===");
for (const theme of getThemes()) {
  console.log(`- ${theme.slug} (${theme.meta.title}) [${theme.meta.color}]`);
  for (const mod of theme.modules) {
    console.log(`  - ${mod.slug} (${mod.meta.title})`);
    for (const lesson of mod.lessons) {
      console.log(
        `    - ${lesson.slug} [${lesson.frontmatter.type}, order=${lesson.frontmatter.order}] ${lesson.frontmatter.title}`,
      );
    }
  }
}

console.log("\n=== All lesson paths ===");
for (const p of getAllLessonPaths()) {
  console.log(`/themes/${p.themeSlug}/${p.slug.join("/")}`);
}

console.log("\n=== Render check (first lesson) ===");
const first = getAllLessonPaths()[0];
if (first) {
  const lesson = getThemes()
    .find((t) => t.slug === first.themeSlug)
    ?.modules.find((m) => m.slug === first.slug[0])
    ?.lessons.find((l) => l.slug === first.slug[1]);
  if (lesson) {
    const rendered = await renderMarkdown(lesson.body);
    console.log("TOC:", rendered.toc);
    console.log("HTML (first 200 chars):", rendered.html.slice(0, 200));
  }
}
