"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./PreviewClient.module.css";
import type { MessageDetail } from "@/lib/types";

export function PreviewClient({ id }: { id: string }) {
  const [message, setMessage] = useState<MessageDetail | null>(null);
  const [tab, setTab] = useState<"email" | "pdf">("email");
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch(`/api/messages/${id}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Not found");
        setMessage(d.message);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  async function exportPdf() {
    setExporting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageIds: [id] }),
      });
      const data = await res.json();
      if (res.ok && data.downloadUrl) {
        window.location.href = data.downloadUrl;
      } else {
        setError(data.error || "Export failed");
      }
    } finally {
      setExporting(false);
    }
  }

  if (error && !message) {
    return (
      <p className={styles.error}>
        {error}. <Link href="/app/library">Back to library</Link>
      </p>
    );
  }
  if (!message) return <p className={styles.muted}>Loading…</p>;

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <Link href="/app/library" className={styles.back}>
          ← Library
        </Link>
        <button type="button" className={styles.exportBtn} onClick={exportPdf} disabled={exporting}>
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
      </div>
      <h1 className={styles.subject}>{message.subject}</h1>
      <div className={styles.meta}>
        <div>
          <strong>From:</strong> {message.from || "—"}
        </div>
        <div>
          <strong>To:</strong> {message.to || "—"}
        </div>
        <div>
          <strong>Date:</strong>{" "}
          {message.date ? new Date(message.date).toLocaleString() : "—"}
        </div>
        {message.attachmentNames.length > 0 && (
          <div>
            <strong>Attachments:</strong> {message.attachmentNames.join(", ")}
          </div>
        )}
      </div>
      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "email"}
          className={tab === "email" ? styles.active : ""}
          onClick={() => setTab("email")}
        >
          Email
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "pdf"}
          className={tab === "pdf" ? styles.active : ""}
          onClick={() => setTab("pdf")}
        >
          PDF preview
        </button>
      </div>
      <div className={styles.panel}>
        {tab === "email" ? (
          message.html ? (
            <iframe
              title="Email HTML"
              className={styles.frame}
              sandbox=""
              srcDoc={message.html}
            />
          ) : (
            <pre className={styles.text}>{message.text || "(empty)"}</pre>
          )
        ) : (
          <div className={styles.pdfPreview}>
            <p className={styles.muted}>
              PDF layout mirrors export: header (from / subject / date), body text, attachment list.
            </p>
            <div className={styles.sheet}>
              <p>
                <strong>Subject:</strong> {message.subject}
              </p>
              <p>
                <strong>From:</strong> {message.from}
              </p>
              <p>
                <strong>To:</strong> {message.to}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {message.date ? new Date(message.date).toUTCString() : "—"}
              </p>
              {message.attachmentNames.length > 0 && (
                <p>
                  <strong>Attachments:</strong> {message.attachmentNames.join(", ")}
                </p>
              )}
              <hr />
              <pre className={styles.text}>{message.text || "(No plain-text body)"}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
