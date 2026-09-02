import Link from "next/link";
import { Monogram } from "./Monogram";
import styles from "./AppHeader.module.css";

const links = [
  { href: "/app", label: "Upload" },
  { href: "/app/library", label: "Library" },
  { href: "/app/exports", label: "Exports" },
  { href: "/app/settings", label: "Settings" },
];

export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/app" className={styles.brand}>
          <Monogram />
          <span>EmailArchiver</span>
        </Link>
        <nav className={styles.nav} aria-label="App">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
