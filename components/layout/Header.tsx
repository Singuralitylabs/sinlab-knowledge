"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import HeaderAuthMenu from "@/components/layout/HeaderAuthMenu";
import type { NavItem } from "@/components/layout/types";

export interface HeaderProps {
  siteTitle: string;
  navigation: NavItem[];
}

export default function Header({ siteTitle, navigation }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Branding splits the wordmark so the second token is accented, matching the
  // design handoff. Fall back to the raw title if it is a single token.
  const [first, ...rest] = siteTitle.split(" ");
  const accented = rest.join(" ");

  return (
    <header className="site-header">
      <div className="wrap site-header__in">
        <Link className="brand" href="/" onClick={() => setIsMenuOpen(false)}>
          <Image className="brand__logo" src="/icon.png" alt="" width={34} height={34} priority />
          <span className="brand__name">
            {first} {accented ? <b>{accented}</b> : null}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav nav--desktop">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <HeaderAuthMenu />
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="nav__toggle"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <div className={`nav__mobile${isMenuOpen ? " is-open" : ""}`}>
        <div className="wrap">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <HeaderAuthMenu />
        </div>
      </div>
    </header>
  );
}
