/**
 * Wraps server-rendered Markdown HTML in a `prose` container tuned for the
 * dark theme. Handles inserting the trusted HTML output of `renderMarkdown`
 * (the source is project-internal Markdown, not user input).
 */

export interface ProseProps {
  /** Trusted HTML emitted by `renderMarkdown` from `lib/content/mdx.ts`. */
  html: string;
  className?: string;
}

const BASE_CLASSES = [
  "prose",
  "prose-invert",
  "prose-base",
  "max-w-none",
  // Headings
  "prose-headings:scroll-mt-20",
  "prose-headings:font-bold",
  "prose-h1:text-3xl",
  "prose-h2:text-2xl",
  "prose-h2:border-b",
  "prose-h2:border-gray-800",
  "prose-h2:pb-2",
  "prose-h3:text-xl",
  // Body
  "prose-p:leading-relaxed",
  "prose-a:text-blue-400",
  "prose-a:no-underline",
  "hover:prose-a:underline",
  "prose-strong:text-white",
  // Inline code
  "prose-code:rounded",
  "prose-code:bg-gray-800/80",
  "prose-code:px-1.5",
  "prose-code:py-0.5",
  "prose-code:text-[0.9em]",
  "prose-code:font-mono",
  "prose-code:before:content-none",
  "prose-code:after:content-none",
  // Pre / code blocks (rehype-pretty-code emits its own background, so we
  // strip prose's defaults and add a frame instead).
  "prose-pre:bg-transparent",
  "prose-pre:p-0",
  "prose-pre:my-6",
  // Blockquotes
  "prose-blockquote:border-l-blue-500/50",
  "prose-blockquote:text-gray-300",
  // Tables
  "prose-table:text-sm",
  "prose-thead:border-gray-700",
  "prose-tr:border-gray-800",
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
