import { readFileSync } from "fs";
import { createRequire } from "module";
import { pathToFileURL } from "url";

const require = createRequire(import.meta.url);
const { simpleParser } = require("mailparser");

function htmlToPlainText(html) {
  if (!html) return "";
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<(br|\/p|\/div|\/tr|\/h[1-6]|\/li)\s*\/?>/gi, "\n");
  s = s.replace(/<li[^>]*>/gi, "- ");
  s = s.replace(/<[^>]+>/g, " ");
  s = s.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
  return s.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

const buf = readFileSync("/home/box/agent-data/agents/9f606d32-4684-4387-8378-42ab89385c0c/attachments/413c28cbd2e8eb451408a560513c6ac086c9441ea2387fac42d506d372f41884.eml");
const mail = await simpleParser(buf);
const html = typeof mail.html === "string" ? mail.html : null;
const text = (mail.text || "").trim() || htmlToPlainText(html) || "";
console.log("hasText", !!(mail.text && mail.text.trim()));
console.log("htmlLen", html ? html.length : 0);
console.log("fallbackLen", text.length);
console.log("---");
console.log(text.slice(0, 600));
