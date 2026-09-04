import Link from "next/link";
import styles from "./MarketingFooter.module.css";

export function MarketingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src="/mark-archive.svg" alt="" width={24} height={24} aria-hidden="true" />
          <p className={styles.copy}>© {new Date().getFullYear()} EmailArchiver</p>
        </div>
        <div className={styles.links}>
          <Link href="/security">Security</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/app">App</Link>
        </div>
      </div>
    </footer>
  );
}
