import Link from "next/link";
import {
  copyrightYear,
  PUBLISHER_NAME,
  PUBLISHER_URL,
  SITE_NAME,
} from "@/lib/site";
import styles from "./MarketingFooter.module.css";

export function MarketingFooter() {
  const year = copyrightYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src="/icon.svg" alt="" width={24} height={24} aria-hidden="true" />
          <p className={styles.copy}>
            © {year} {PUBLISHER_NAME}. {SITE_NAME} is made by{" "}
            <a href={PUBLISHER_URL} rel="noopener noreferrer" target="_blank">
              {PUBLISHER_NAME}
            </a>
            .
          </p>
        </div>
        <div className={styles.links}>
          <Link href="/">Home</Link>
          <Link href="/security">Security</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/app">App</Link>
        </div>
      </div>
    </footer>
  );
}
