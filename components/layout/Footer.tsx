import Image from "next/image";
import Link from "next/link";
import type { NavItem } from "@/components/layout/types";
import { getThemes } from "@/lib/themes";

export interface FooterCopyright {
  holder: string;
  url?: string;
}

export interface FooterProps {
  siteTitle: string;
  description?: string;
  navigation: NavItem[];
  copyright?: FooterCopyright;
}

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function Footer({ siteTitle, description, navigation, copyright }: FooterProps) {
  const year = new Date().getFullYear();
  const copyrightName = copyright?.holder ?? siteTitle;
  const themes = getThemes();

  const [first, ...rest] = siteTitle.split(" ");
  const accented = rest.join(" ");

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link className="brand" href="/">
              <Image className="brand__logo" src="/icon.png" alt="" width={34} height={34} />
              <span className="brand__name">
                {first} {accented ? <b>{accented}</b> : null}
              </span>
            </Link>
            {description ? <p>{description}</p> : null}
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <h4>Themes</h4>
              {themes.map((theme) => (
                <Link key={theme.slug} href={`/themes/${theme.slug}`}>
                  {theme.meta.shortTitle ?? theme.meta.title}
                </Link>
              ))}
            </div>
            {navigation.length > 0 ? (
              <div className="footer__col">
                <h4>Site</h4>
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="footer__base">
          <span>
            © {year} {copyrightName}
          </span>
          {copyright?.url ? (
            <a href={copyright.url} target="_blank" rel="noopener noreferrer">
              {stripProtocol(copyright.url)}
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
