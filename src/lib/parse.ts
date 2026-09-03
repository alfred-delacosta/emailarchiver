import { simpleParser, type ParsedMail, type Attachment } from "mailparser";
import { randomUUID } from "crypto";
import type { MessageMeta } from "./types";
import { htmlToPlainText } from "./html";

export type ParsedMessage = {
  meta: MessageMeta;
  text: string;
  html: string | null;
};

function addrToString(v: ParsedMail["from"] | ParsedMail["to"]): string {
  if (!v) return "";
  const list = Array.isArray(v) ? v : [v];
  return list
    .map((a) => {
      if (!a) return "";
      if (typeof a === "string") return a;
      if ("text" in a && a.text) return a.text;
      if ("value" in a && Array.isArray(a.value)) {
        return a.value
          .map((x: { address?: string; name?: string }) => x.address || x.name || "")
          .filter(Boolean)
          .join(", ");
      }
      return "";
    })
    .filter(Boolean)
    .join(", ");
}

function attachmentNames(atts: Attachment[] | undefined): string[] {
  if (!atts?.length) return [];
  return atts.map((a) => a.filename || "attachment").filter(Boolean);
}

function previewFrom(text: string, html: string | null): string {
  const raw = (text || "").trim() || (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return raw.slice(0, 180);
}

export async function parseEmlBuffer(
  buf: Buffer,
  sourceFile: string
): Promise<ParsedMessage> {
  const mail = await simpleParser(buf);
  const html =
    typeof mail.html === "string"
      ? mail.html
      : typeof (mail as { textAsHtml?: string }).textAsHtml === "string"
        ? (mail as { textAsHtml?: string }).textAsHtml || null
        : null;
  // Prefer text/plain; fall back to stripped HTML (common for newsletters / GovDelivery)
  const text =
    (mail.text || "").trim() || htmlToPlainText(html) || "";
  const names = attachmentNames(mail.attachments);
  const meta: MessageMeta = {
    id: randomUUID(),
    subject: mail.subject || "(no subject)",
    from: addrToString(mail.from),
    to: addrToString(mail.to),
    date: mail.date ? mail.date.toISOString() : null,
    hasAttachments: names.length > 0,
    attachmentNames: names,
    preview: previewFrom(text, html),
    sourceFile,
    createdAt: new Date().toISOString(),
  };
  return { meta, text, html };
}

/** Split mbox into individual message buffers (From_ lines). */
export function splitMbox(buf: Buffer): Buffer[] {
  const text = buf.toString("utf8");
  // Standard mbox: lines starting with "From " (space) at beginning of message
  const parts = text.split(/^From /m);
  const out: Buffer[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part || !part.trim()) continue;
    // Re-prefix except empty leading split
    const raw = i === 0 && !text.startsWith("From ") ? part : "From " + part;
    // Skip if it doesn't look like a message
    if (!/^(From |[A-Za-z-]+:)/m.test(raw.trim())) continue;
    out.push(Buffer.from(raw, "utf8"));
  }
  return out.length ? out : [buf];
}

export async function parseMboxBuffer(
  buf: Buffer,
  sourceFile: string
): Promise<ParsedMessage[]> {
  const chunks = splitMbox(buf);
  const results: ParsedMessage[] = [];
  for (let i = 0; i < chunks.length; i++) {
    try {
      const parsed = await parseEmlBuffer(chunks[i], `${sourceFile}#${i + 1}`);
      results.push(parsed);
    } catch {
      // skip bad message inside mbox
    }
  }
  return results;
}
