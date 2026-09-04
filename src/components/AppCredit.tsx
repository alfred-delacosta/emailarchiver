import {
  copyrightYear,
  PUBLISHER_NAME,
  PUBLISHER_URL,
  SITE_NAME,
} from "@/lib/site";
import styles from "./AppCredit.module.css";

export function AppCredit() {
  const year = copyrightYear();
  return (
    <footer className={styles.credit} aria-label="Copyright">
      <p>
        © {year} {PUBLISHER_NAME}. {SITE_NAME} is made by{" "}
        <a href={PUBLISHER_URL} rel="noopener noreferrer" target="_blank">
          {PUBLISHER_NAME}
        </a>
        .
      </p>
    </footer>
  );
}
