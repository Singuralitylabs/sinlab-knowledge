"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/content/mdx";

export interface TOCProps {
  items: TocItem[];
}

/**
 * Right-rail table of contents. Highlights the heading currently in view via
 * IntersectionObserver. The page is responsible for rendering headings with
 * matching `id` attributes (rehype-slug provides this).
 */
export default function TOC({ items }: TOCProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    // Resolve heading elements lazily — they are part of the static markup
    // injected via dangerouslySetInnerHTML so they exist by the time this
    // effect runs.
    const headings: HTMLElement[] = [];
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el instanceof HTMLElement) headings.push(el);
    }

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting heading; fall back to the last heading
        // above the viewport when nothing is currently intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    for (const el of headings) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="このページの目次" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        On this page
      </p>
      <ul className="space-y-1 border-l border-gray-800">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} style={{ paddingLeft: item.depth === 3 ? "0.75rem" : 0 }}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`-ml-px block border-l py-1 pl-3 transition ${
                  isActive
                    ? "border-blue-400 font-medium text-blue-300"
                    : "border-transparent text-gray-500 hover:border-gray-600 hover:text-gray-300"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
