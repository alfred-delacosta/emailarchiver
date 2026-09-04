"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import styles from "./AppHeader.module.css";

const links = [
  { href: "/app", label: "Upload", exact: true },
  { href: "/app/library", label: "Library" },
  { href: "/app/exports", label: "Exports" },
  { href: "/app/settings", label: "Settings" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <BrandLogo href="/" lockup="horizontal" onNavigate={() => setOpen(false)} />
          <Link href="/" className={styles.homeBtn} onClick={() => setOpen(false)}>
            Home
          </Link>
        </div>

        <nav className={styles.nav} aria-label="App">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(pathname, l.href, l.exact) ? styles.active : undefined}
              aria-current={isActive(pathname, l.href, l.exact) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="app-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
      </div>

      <div
        id="app-mobile-nav"
        className={`${styles.mobilePanel} ${open ? styles.open : ""}`}
      >
        <nav aria-label="App mobile">
          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(pathname, l.href, l.exact) ? styles.active : undefined}
              aria-current={isActive(pathname, l.href, l.exact) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
