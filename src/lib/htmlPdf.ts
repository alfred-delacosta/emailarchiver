import puppeteer from "puppeteer-core";
import { PDFDocument } from "pdf-lib";
import type { MessageDetail } from "./types";

export type EmailPdfInput = {
  subject: string;
  from: string;
  to: string;
  date: string | null;
  html: string | null;
  text: string;
  attachmentNames?: string[];
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Light sanitize: strip scripts and inline event handlers. */
export function sanitizeEmailHtml(html: string): string {
  let s = html;
  s = s.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<\/?script\b[^>]*>/gi, "");
  // Remove on* event handler attributes
  s = s.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // Neutralize javascript: URLs in href/src
  s = s.replace(
    /\s(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi,
    ' $1="#"'
  );
  return s;
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  try {
    return new Date(date).toUTCString();
  } catch {
    return date;
  }
}

function buildDocumentHtml(input: EmailPdfInput): string {
  const subject = escapeHtml(input.subject || "(no subject)");
  const from = escapeHtml(input.from || "—");
  const to = escapeHtml(input.to || "—");
  const date = escapeHtml(formatDate(input.date));
  const attachments =
    input.attachmentNames && input.attachmentNames.length
      ? `<div class="meta-row"><strong>Attachments:</strong> ${escapeHtml(
          input.attachmentNames.join(", ")
        )}</div>`
      : "";

  let bodyHtml: string;
  if (input.html && input.html.trim()) {
    bodyHtml = sanitizeEmailHtml(input.html);
  } else {
    const plain = (input.text || "").trim() || "(No message body could be extracted)";
    bodyHtml = `<pre class="plain">${escapeHtml(plain)}</pre>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: https: http:; style-src 'unsafe-inline'; font-src data: https: http:;" />
  <base target="_blank" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #0f172a;
      line-height: 1.45;
    }
    .header {
      padding: 0 0 12px 0;
      margin-bottom: 16px;
      border-bottom: 1px solid #e2e8f0;
    }
    .header .subject {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 10px 0;
    }
    .meta-row {
      margin: 4px 0;
      font-size: 13px;
      word-break: break-word;
    }
    .meta-row strong { color: #0f172a; }
    .body { word-wrap: break-word; overflow-wrap: anywhere; }
    .body img { max-width: 100%; height: auto; }
    .plain {
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="subject">${subject}</div>
    <div class="meta-row"><strong>From:</strong> ${from}</div>
    <div class="meta-row"><strong>To:</strong> ${to}</div>
    <div class="meta-row"><strong>Date:</strong> ${date}</div>
    ${attachments}
  </div>
  <div class="body">${bodyHtml}</div>
</body>
</html>`;
}

async function launchBrowser() {
  const executablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome";
  return puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });
}

/** Render a single email to a PDF buffer (visual HTML match). */
export async function renderEmailHtmlToPdf(
  input: EmailPdfInput
): Promise<Uint8Array> {
  const html = buildDocumentHtml(input);
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30_000,
    });
    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: {
        top: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
        right: "0.5in",
      },
    });
    return new Uint8Array(pdf);
  } finally {
    await browser.close().catch(() => undefined);
  }
}

/** Render many messages: one PDF each, then merge with pdf-lib. */
export async function messagesToHtmlPdf(
  messages: MessageDetail[]
): Promise<Uint8Array> {
  if (!messages.length) {
    throw new Error("No messages to render");
  }

  if (messages.length === 1) {
    const m = messages[0];
    return renderEmailHtmlToPdf({
      subject: m.subject,
      from: m.from,
      to: m.to,
      date: m.date,
      html: m.html,
      text: m.text,
      attachmentNames: m.attachmentNames,
    });
  }

  const browser = await launchBrowser();
  const parts: Uint8Array[] = [];
  try {
    for (const m of messages) {
      const html = buildDocumentHtml({
        subject: m.subject,
        from: m.from,
        to: m.to,
        date: m.date,
        html: m.html,
        text: m.text,
        attachmentNames: m.attachmentNames,
      });
      const page = await browser.newPage();
      try {
        await page.setContent(html, {
          waitUntil: "networkidle0",
          timeout: 30_000,
        });
        const pdf = await page.pdf({
          format: "Letter",
          printBackground: true,
          margin: {
            top: "0.5in",
            bottom: "0.5in",
            left: "0.5in",
            right: "0.5in",
          },
        });
        parts.push(new Uint8Array(pdf));
      } finally {
        await page.close().catch(() => undefined);
      }
    }
  } finally {
    await browser.close().catch(() => undefined);
  }

  const merged = await PDFDocument.create();
  for (const part of parts) {
    const src = await PDFDocument.load(part);
    const pages = await merged.copyPages(src, src.getPageIndices());
    for (const p of pages) merged.addPage(p);
  }
  return merged.save();
}
