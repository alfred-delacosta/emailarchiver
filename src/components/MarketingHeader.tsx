import Link from "next/link";
import { Monogram } from "./Monogram";
import styles from "./MarketingHeader.module.css";

export function MarketingHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <Monogram />
          <span>EmailArchiver</span>
        </Link>
        <nav className={styles.nav} aria-label="Marketing">
          <Link href="/features">Features</Link>
          <Link href="/security">Security</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/app" className={styles.cta}>
            Open app
          </Link>
        </nav>
      </div>
    </header>
  );
}
