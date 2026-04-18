import type { ReactNode } from "react";

export interface DocLayoutProps {
  /** Left sidebar content (typically a `<Sidebar />`). Hidden on small screens. */
  sidebar?: ReactNode;
  /** Right table-of-contents (typically a `<TOC />`). Hidden below xl. */
  toc?: ReactNode;
  /** Main content. */
  children: ReactNode;
}

/**
 * Three-column documentation layout (sidebar / main / toc) used by lesson and
 * module pages. All slots are optional; the grid template adapts to whichever
 * slots are present.
 *
 * - `sidebar` shows from `md` upward
 * - `toc` shows from `xl` upward
 */
export default function DocLayout({ sidebar, toc, children }: DocLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_240px]">
        <aside className="hidden md:block">
          {sidebar ? (
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
              {sidebar}
            </div>
          ) : null}
        </aside>

        <main className="min-w-0">{children}</main>

        <aside className="hidden xl:block">
          {toc ? (
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pl-2">{toc}</div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
