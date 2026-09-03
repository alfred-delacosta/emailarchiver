import { readFileSync, writeFileSync, statSync } from "fs";
import { parseEmlBuffer } from "../src/lib/parse";
import { renderEmailHtmlToPdf } from "../src/lib/htmlPdf";
async function main() {
  const emlPath = process.argv[2];
  const outPath = process.argv[3] || "/tmp/test-email.pdf";
  const buf = readFileSync(emlPath);
  const parsed = await parseEmlBuffer(buf, "sample.eml");
  console.log("subject:", parsed.meta.subject);
  console.log("htmlLen:", parsed.html ? parsed.html.length : 0);
  const pdf = await renderEmailHtmlToPdf({
    subject: parsed.meta.subject,
    from: parsed.meta.from,
    to: parsed.meta.to,
    date: parsed.meta.date,
    html: parsed.html,
    text: parsed.text,
    attachmentNames: parsed.meta.attachmentNames,
  });
  writeFileSync(outPath, Buffer.from(pdf));
  const size = statSync(outPath).size;
  console.log("pdfBytes:", size);
  if (size <= 10000) { console.error("FAIL"); process.exit(1); }
  console.log("OK");
}
main().catch((e)=>{ console.error(e); process.exit(1); });
