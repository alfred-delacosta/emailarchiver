"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Dropzone.module.css";
import type { UploadFileResult } from "@/lib/types";

const ACCEPT = ".eml,.mbox,.zip";

export function Dropzone() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<UploadFileResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!list.length) return;
      setBusy(true);
      setError(null);
      setResults(null);
      try {
        const fd = new FormData();
        list.forEach((f) => fd.append("files", f));
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Upload failed");
          return;
        }
        setResults(data.results as UploadFileResult[]);
        const okCount = (data.results as UploadFileResult[]).reduce(
          (n, r) => n + (r.status === "ok" ? r.messageCount : 0),
          0
        );
        if (okCount > 0) {
          setTimeout(() => router.push("/app/library"), 800);
        }
      } catch {
        setError("Network error during upload");
      } finally {
        setBusy(false);
      }
    },
    [router]
  );

  return (
    <div className={styles.wrap}>
      <div
        className={`${styles.zone} ${dragging ? styles.dragging : ""} ${busy ? styles.busy : ""}`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
        }}
      >
        <p className={styles.title}>Drop .eml, .mbox, or .zip here</p>
        <p className={styles.limits}>
          Up to <strong>25 MB</strong> per file · <strong>50 files</strong> per batch
        </p>
        <label className={styles.btn}>
          {busy ? "Parsing…" : "Choose files"}
          <input
            type="file"
            accept={ACCEPT}
            multiple
            className={styles.input}
            disabled={busy}
            onChange={(e) => {
              if (e.target.files?.length) upload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div className={styles.privacy}>
        <strong>Privacy:</strong> Files are stored only on this server for your session.
        No live inbox access. Wipe anytime in Settings.
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {results && (
        <ul className={styles.results}>
          {results.map((r) => (
            <li key={r.filename + r.status} className={r.status === "ok" ? styles.ok : styles.bad}>
              <span className={styles.fname}>{r.filename}</span>
              {r.status === "ok" ? (
                <span>{r.messageCount} message{r.messageCount === 1 ? "" : "s"}</span>
              ) : (
                <span>{r.error}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
