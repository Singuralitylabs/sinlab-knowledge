/**
 * Wraps server-rendered Markdown HTML in a `prose` container tuned for the
 * light theme. Handles inserting the trusted HTML output of `renderMarkdown`
 * (the source is project-internal Markdown, not user input).
 */

export interface ProseProps {
  /** Trusted HTML emitted by `renderMarkdown` from `lib/content/mdx.ts`. */
  html: string;
  className?: string;
}

const BASE_CLASSES = [
  "prose",
  "prose-base",
  "prose-gray",
  "max-w-none",
  // Headings
  "prose-headings:scroll-mt-20",
  "prose-headings:font-bold",
  "prose-headings:text-gray-900",
  "prose-h1:text-3xl",
  "prose-h2:text-2xl",
  "prose-h2:mt-10",
  "prose-h3:text-xl",
  "prose-h3:mt-8",
  // Body
  "prose-p:leading-relaxed",
  "prose-p:text-gray-700",
  "prose-li:text-gray-700",
  "prose-a:text-blue-600",
  "prose-a:no-underline",
  "hover:prose-a:underline",
  "prose-strong:text-gray-900",
  // Inline code
  "prose-code:rounded",
  "prose-code:border",
  "prose-code:border-gray-200",
  "prose-code:bg-gray-50",
  "prose-code:px-1.5",
  "prose-code:py-0.5",
  "prose-code:text-[0.875em]",
  "prose-code:font-mono",
  "prose-code:font-medium",
  "prose-code:text-purple-700",
  "prose-code:before:content-none",
  "prose-code:after:content-none",
  // Pre / code blocks (rehype-pretty-code emits its own background, so we
  // strip prose's defaults and add a frame instead).
  "prose-pre:bg-transparent",
  "prose-pre:p-0",
  "prose-pre:my-6",
  // Blockquotes
  "prose-blockquote:border-l-blue-500/60",
  "prose-blockquote:text-gray-600",
  // Tables
  "prose-table:text-sm",
  "prose-thead:border-gray-300",
  "prose-tr:border-gray-200",
].join(" ");

export default function Prose({ html, className }: ProseProps) {
  const classes = className ? `${BASE_CLASSES} ${className}` : BASE_CLASSES;
  return (
    <article
      className={classes}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted Markdown output from internal content
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
