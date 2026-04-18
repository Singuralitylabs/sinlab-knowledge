/**
 * Lightweight shared types for layout components.
 *
 * These intentionally do not import from `lib/content/schema` so that the
 * components stay decoupled from the zod runtime — the page-level Server
 * Components map domain types into these props.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
