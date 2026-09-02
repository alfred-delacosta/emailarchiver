import Link from "next/link";
import styles from "./MarketingFooter.module.css";

export function MarketingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>© {new Date().getFullYear()} EmailArchiver</p>
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
