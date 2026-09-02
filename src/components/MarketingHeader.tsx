"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Monogram } from "./Monogram";
import styles from "./MarketingHeader.module.css";

const links = [
  { href: "/features", label: "Features" },
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <Monogram />
          <span>EmailArchiver</span>
        </Link>
        <nav className={styles.nav} aria-label="Marketing">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? styles.active : undefined}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/app" className={styles.cta}>
            Open app
          </Link>
        </nav>
        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="mkt-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>
      <div
        id="mkt-mobile-nav"
        className={`${styles.mobilePanel} ${open ? styles.open : ""}`}
      >
        <nav aria-label="Marketing mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? styles.active : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/app" className={styles.cta} onClick={() => setOpen(false)}>
            Open app
          </Link>
        </nav>
      </div>
    </header>
  );
}
