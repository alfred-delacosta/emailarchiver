"use client";

import { useState } from "react";
import styles from "./SettingsClient.module.css";

export function SettingsClient() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function wipe() {
    if (!confirm("Delete all uploaded messages and exports for this session?")) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/data", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setStatus("Session data deleted.");
    } catch {
      setStatus("Could not delete data.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <section className={styles.card}>
        <h2>PDF options</h2>
        <p className={styles.muted}>
          v1 exports use a structured layout: subject, from, to, date, attachments, then plain-text
          body via pdf-lib (no Chromium).
        </p>
        <label className={styles.row}>
          <input type="checkbox" checked readOnly />
          Include attachment filenames
        </label>
        <label className={styles.row}>
          <input type="checkbox" checked readOnly />
          One message per PDF section / page break
        </label>
      </section>

      <section className={styles.card}>
        <h2>Connected accounts</h2>
        <p className={styles.muted}>Gmail OAuth — Coming soon. No accounts connected in v1.</p>
        <button type="button" className={styles.disabled} disabled>
          Connect Gmail (Coming soon)
        </button>
      </section>

      <section className={styles.card}>
        <h2>Delete data</h2>
        <p className={styles.muted}>
          Wipes session uploads, parsed messages, and generated PDFs stored under{" "}
          <code className="mono">.data/</code>. Production should use object storage with retention
          policies.
        </p>
        <button type="button" className={styles.danger} onClick={wipe} disabled={busy}>
          {busy ? "Deleting…" : "Delete all session data"}
        </button>
        {status && <p className={styles.status}>{status}</p>}
      </section>
    </div>
  );
}
