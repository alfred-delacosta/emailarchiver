"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./LibraryClient.module.css";
import type { MessageMeta } from "@/lib/types";

function AttachmentIcon() {
  return (
    <svg
      className={styles.attIcon}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LibraryClient() {
  const [messages, setMessages] = useState<MessageMeta[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [fallbackBanner, setFallbackBanner] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .finally(() => setLoading(false));
  }, []);

  const allSelected = useMemo(
    () => messages.length > 0 && selected.size === messages.length,
    [messages, selected]
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(messages.map((m) => m.id)));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function exportSelected() {
    if (!selected.size) return;
    setExporting(true);
    setFallbackBanner(null);
    setProgress(`Exporting ${selected.size} message${selected.size === 1 ? "" : "s"}…`);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProgress(data.error || "Export failed");
        return;
      }
      if (data.renderMode === "text-fallback") {
        const reason = data.fallbackReason
          ? `: ${data.fallbackReason}`
          : "";
        const msg = `PDF used text fallback (HTML render failed)${reason}`;
        setFallbackBanner(msg);
        window.alert(msg);
      }
      setProgress("Done — downloading…");
      if (data.downloadUrl) {
        window.location.href = data.downloadUrl;
      }
    } catch {
      setProgress("Network error");
    } finally {
      setExporting(false);
      setTimeout(() => setProgress(null), 2500);
    }
  }

  if (loading) return <p className={styles.muted}>Loading library…</p>;
  if (!messages.length) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Drop .eml or .mbox to get started</p>
        <p className={styles.emptySub}>
          Upload files to build your session library, then export to PDF.
        </p>
        <Link href="/app" className={styles.emptyCta}>
          Go to Upload
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {selected.size > 0 && (
        <div className={styles.bulk}>
          <span>{selected.size} selected</span>
          <div className={styles.bulkActions}>
            <button type="button" onClick={exportSelected} disabled={exporting}>
              Export {selected.size} as PDF
            </button>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={clearSelection}
              disabled={exporting}
            >
              Clear selection
            </button>
          </div>
        </div>
      )}
      {fallbackBanner && (
        <div className={styles.fallbackBanner} role="alert">
          {fallbackBanner}
        </div>
      )}
      {progress && <p className={styles.progress}>{progress}</p>}
      <div className={styles.toolbar}>
        <label className={styles.check}>
          <input type="checkbox" checked={allSelected} onChange={toggleAll} />
          Select all
        </label>
        <span className={styles.muted}>{messages.length} messages</span>
      </div>
      <ul className={styles.list}>
        {messages.map((m) => (
          <li key={m.id} className={styles.row}>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={selected.has(m.id)}
                onChange={() => toggle(m.id)}
              />
            </label>
            <Link href={`/app/preview/${m.id}`} className={styles.main}>
              <div className={styles.subject}>{m.subject}</div>
              <div className={styles.meta}>
                <span>{m.from || "Unknown"}</span>
                <span>·</span>
                <span>{m.date ? new Date(m.date).toLocaleString() : "No date"}</span>
                {m.hasAttachments && (
                  <span className={styles.att} title="Has attachments">
                    <AttachmentIcon />
                    <span className="sr-only">Has attachments</span>
                  </span>
                )}
              </div>
              <div className={styles.preview}>{m.preview}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
