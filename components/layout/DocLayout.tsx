import type { ReactNode } from "react";

export interface DocLayoutProps {
  /** Left sidebar content (typically a `<TOC />`). Hidden on small screens. */
  sidebar?: ReactNode;
  /** Main content. */
  children: ReactNode;
}

/**
 * Two-column documentation layout (sidebar / main) used by lesson and detail
 * pages. The sidebar shows from `md` upward.
 */
export default function DocLayout({ sidebar, children }: DocLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          {sidebar ? (
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
              {sidebar}
            </div>
          ) : null}
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
