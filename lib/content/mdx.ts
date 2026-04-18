import GithubSlugger from "github-slugger";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

export interface RenderedMarkdown {
  html: string;
  toc: TocItem[];
}

function extractText(node: unknown): string {
  // biome-ignore lint/suspicious/noExplicitAny: walking arbitrary mdast nodes
  const n = node as any;
  if (typeof n.value === "string") return n.value;
  if (Array.isArray(n.children)) return n.children.map(extractText).join("");
  return "";
}

/**
 * Render Markdown source to HTML and extract a table of contents from H2/H3.
 * Uses the same toolchain as the original web-skill-lessons site, plus GFM
 * Alerts (`> [!NOTE]` etc.) and slug ids for headings.
 */
export async function renderMarkdown(source: string): Promise<RenderedMarkdown> {
  const toc: TocItem[] = [];
  // Mirror rehype-slug's dedup behavior so TOC ids match the rendered heading
  // ids even when the same text (e.g. "表示結果") appears multiple times.
  const slugger = new GithubSlugger();

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkAlert)
    .use(() => (tree) => {
      visit(tree, "heading", (node: unknown) => {
        // biome-ignore lint/suspicious/noExplicitAny: mdast heading node
        const heading = node as any;
        if (heading.depth !== 2 && heading.depth !== 3) return;
        const text = extractText(heading);
        if (!text) return;
        toc.push({ id: slugger.slug(text), text, depth: heading.depth });
      });
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: "github-dark-dimmed",
      keepBackground: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(source);

  return { html: String(result), toc };
}
