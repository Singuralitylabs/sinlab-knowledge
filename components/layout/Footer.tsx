import Link from "next/link";
import type { NavItem } from "@/components/layout/types";

export interface FooterProps {
  siteTitle: string;
  description?: string;
  links: NavItem[];
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export default function Footer({ siteTitle, description, links }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50 px-6 py-10 text-sm text-gray-600">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2">
        <div>
          <p className="mb-1 font-bold text-gray-900">{siteTitle}</p>
          {description ? (
            <p className="text-xs leading-relaxed text-gray-500">{description}</p>
          ) : null}
        </div>

        {links.length > 0 ? (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              リンク
            </p>
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  {isExternal(link.href) ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-gray-600 hover:text-gray-900">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-gray-200 pt-4 text-xs text-gray-500">
        © {new Date().getFullYear()} {siteTitle}
      </div>
    </footer>
  );
}
