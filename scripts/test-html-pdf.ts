import { readFileSync, writeFileSync, statSync } from "fs";
import { parseEmlBuffer } from "../src/lib/parse";
import { messagesToHtmlPdf } from "../src/lib/htmlPdf";
import type { MessageDetail } from "../src/lib/types";

async function main() {
  const emlPath = process.argv[2];
  const outPath = process.argv[3] || "/tmp/test-html-email.pdf";
  if (!emlPath) {
    console.error("Usage: npx tsx scripts/test-html-pdf.ts <eml> [out.pdf]");
    process.exit(1);
  }
  const buf = readFileSync(emlPath);
  const parsed = await parseEmlBuffer(buf, "sample.eml");
  console.log("subject:", parsed.meta.subject);
  console.log("htmlLen:", parsed.html ? parsed.html.length : 0);

  const detail: MessageDetail = {
    ...parsed.meta,
    text: parsed.text,
    html: parsed.html,
  };

  const pdf = await messagesToHtmlPdf([detail]);
  writeFileSync(outPath, Buffer.from(pdf));
  const size = statSync(outPath).size;
  console.log("pdfBytes:", size);
  if (size <= 10000) {
    console.error("FAIL: PDF too small (likely text fallback or empty)");
    process.exit(1);
  }
  console.log("OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
