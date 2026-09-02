import styles from "./SourceCards.module.css";

export function SourceCards() {
  return (
    <div className={styles.grid}>
      <article className={styles.card}>
        <div className={styles.badgeActive}>Active</div>
        <h3>Upload files</h3>
        <p>Import .eml, .mbox, or a zip of those. Parsed locally into your library.</p>
      </article>
      <article className={`${styles.card} ${styles.soon}`}>
        <div className={styles.badgeSoon}>Coming soon</div>
        <h3>Gmail</h3>
        <p>Connect a Gmail mailbox to archive messages. OAuth not available in v1.</p>
      </article>
    </div>
  );
}
