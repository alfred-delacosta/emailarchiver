/** Best-effort HTML → plain text for PDF/preview when mail has no text/plain part. */
export function htmlToPlainText(html: string | null | undefined): string {
  if (!html) return "";
  let s = html;
  // Drop scripts/styles
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  // Block breaks
  s = s.replace(/<(br|\/p|\/div|\/tr|\/h[1-6]|\/li)\s*\/?>/gi, "\n");
  s = s.replace(/<li[^>]*>/gi, "- ");
  // Strip tags
  s = s.replace(/<[^>]+>/g, " ");
  // Entities
  s = s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => {
      try {
        return String.fromCharCode(Number(n));
      } catch {
        return " ";
      }
    });
  // Collapse whitespace but keep newlines
  s = s
    .split("\n")
    .map((line) => line.replace(/[ \t\f\v]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return s;
}
