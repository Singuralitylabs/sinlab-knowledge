import Link from "next/link";
import { Fragment } from "react";
import type { BreadcrumbItem } from "@/components/layout/types";

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Renders a `>` separated breadcrumb. The last item is always rendered as
 * plain text (the current page); earlier items render as links when they have
 * an `href`.
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="パンくずリスト" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          // Use href when present (stable across renders) and fall back to a
          // composite key for label-only items.
          const key = item.href ?? `${item.label}#${index}`;
          return (
            <Fragment key={key}>
              <li className="flex items-center">
                {isLast || !item.href ? (
                  <span className={isLast ? "text-gray-900" : undefined}>{item.label}</span>
                ) : (
                  <Link href={item.href} className="hover:text-gray-800">
                    {item.label}
                  </Link>
                )}
              </li>
              {!isLast ? (
                <li aria-hidden="true" className="text-gray-300">
                  /
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
