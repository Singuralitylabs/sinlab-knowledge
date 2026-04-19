import GithubSlugger from "github-slugger";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
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

/**
 * Reference to a detail sub-page resolvable by the `::detail{slug="..."}`
 * directive. Supplied by the page via the render context.
 */
export interface DetailRef {
  slug: string;
  title: string;
  description?: string;
  href: string;
}

/**
 * Tailwind class strings used to theme directive cards. Provided by the page
 * because color tokens are theme-specific.
 */
export interface DirectiveThemeClasses {
  border: string;
  borderHover: string;
  bgSoft: string;
  text: string;
}

export interface RenderContext {
  /** Detail sub-pages keyed by slug for resolving `::detail{slug="..."}`. */
  details?: Map<string, DetailRef>;
  /** Theme colors applied to directive cards. */
  directiveTheme?: DirectiveThemeClasses;
}

const DEFAULT_DIRECTIVE_THEME: DirectiveThemeClasses = {
  border: "border-gray-200",
  borderHover: "hover:border-gray-400",
  bgSoft: "bg-gray-50",
  text: "text-gray-700",
};

function extractText(node: unknown): string {
  // biome-ignore lint/suspicious/noExplicitAny: walking arbitrary mdast nodes
  const n = node as any;
  if (typeof n.value === "string") return n.value;
  if (Array.isArray(n.children)) return n.children.map(extractText).join("");
  return "";
}

/**
 * Remark plugin that turns `::detail{slug="..."}` leaf directives into a card
 * link to the matching detail sub-page. Unknown slugs render a visible error
 * so content bugs surface during authoring.
 */
function remarkDetailDirective(context: RenderContext) {
  const theme = context.directiveTheme ?? DEFAULT_DIRECTIVE_THEME;
  const cardClasses = [
    "not-prose",
    "my-6",
    "block",
    "rounded-lg",
    "border",
    theme.border,
    theme.borderHover,
    theme.bgSoft,
    "px-4",
    "py-3",
    "no-underline",
    "transition",
  ].join(" ");
  const errorClasses = [
    "not-prose",
    "my-6",
    "block",
    "rounded-lg",
    "border",
    "border-red-300",
    "bg-red-50",
    "px-4",
    "py-3",
    "text-sm",
    "text-red-800",
  ].join(" ");

  return (tree: unknown) => {
    visit(tree as never, (node: unknown) => {
      // biome-ignore lint/suspicious/noExplicitAny: remark directive node
      const n = node as any;
      if (n.type !== "leafDirective" || n.name !== "detail") return;

      const slug = typeof n.attributes?.slug === "string" ? n.attributes.slug : undefined;
      if (!slug) {
        n.data = {
          hName: "div",
          hProperties: { className: errorClasses },
          hChildren: [
            {
              type: "text",
              value: '::detail{slug="..."} に slug が指定されていません',
            },
          ],
        };
        return;
      }

      const detail = context.details?.get(slug);
      if (!detail) {
        n.data = {
          hName: "div",
          hProperties: { className: errorClasses },
          hChildren: [
            {
              type: "text",
              value: `詳細サブページ "${slug}" が見つかりません`,
            },
          ],
        };
        return;
      }

      const labelChildren = [
        {
          type: "element",
          tagName: "span",
          properties: {
            className: "block text-sm font-medium text-gray-900",
          },
          children: [{ type: "text", value: `${detail.title} →` }],
        },
      ];
      if (detail.description) {
        labelChildren.push({
          type: "element",
          tagName: "span",
          properties: {
            className: "mt-0.5 block text-xs text-gray-600",
          },
          children: [{ type: "text", value: detail.description }],
        });
      }

      n.data = {
        hName: "a",
        hProperties: {
          href: detail.href,
          className: cardClasses,
        },
        hChildren: labelChildren,
      };
    });
  };
}

/**
 * Render Markdown source to HTML and extract a table of contents from H2/H3.
 * Uses the same toolchain as the original web-skill-lessons site, plus GFM
 * Alerts (`> [!NOTE]` etc.), slug ids for headings, and the
 * `::detail{slug="..."}` directive for inline detail sub-page links.
 */
export async function renderMarkdown(
  source: string,
  context: RenderContext = {},
): Promise<RenderedMarkdown> {
  const toc: TocItem[] = [];
  // Mirror rehype-slug's dedup behavior so TOC ids match the rendered heading
  // ids even when the same text (e.g. "表示結果") appears multiple times.
  const slugger = new GithubSlugger();

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkDetailDirective, context)
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
      theme: "github-light",
      keepBackground: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(source);

  return { html: String(result), toc };
}
