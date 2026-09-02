import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { MessageDetail } from "./types";

function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  const paragraphs = text.replace(/\r\n/g, "\n").split("\n");
  for (const para of paragraphs) {
    if (!para) {
      lines.push("");
      continue;
    }
    let remaining = para;
    while (remaining.length > maxChars) {
      let breakAt = remaining.lastIndexOf(" ", maxChars);
      if (breakAt < maxChars * 0.5) breakAt = maxChars;
      lines.push(remaining.slice(0, breakAt));
      remaining = remaining.slice(breakAt).trimStart();
    }
    if (remaining) lines.push(remaining);
  }
  return lines;
}

export async function messagesToPdf(messages: MessageDetail[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const mono = await doc.embedFont(StandardFonts.Courier);

  const margin = 50;
  const pageWidth = 612;
  const pageHeight = 792;
  const contentWidth = pageWidth - margin * 2;
  const fontSize = 10;
  const headerSize = 12;
  const lineHeight = 14;
  const maxChars = 90;

  for (const msg of messages) {
    let page = doc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    const drawLine = (label: string, value: string, bold = false) => {
      if (y < margin + lineHeight * 2) {
        page = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(label, {
        x: margin,
        y,
        size: headerSize,
        font: fontBold,
        color: rgb(0.06, 0.09, 0.16),
      });
      const labelWidth = fontBold.widthOfTextAtSize(label, headerSize);
      const val = value || "—";
      const wrapped = wrapText(val, maxChars - Math.ceil(labelWidth / 6));
      page.drawText(wrapped[0] || "", {
        x: margin + labelWidth + 4,
        y,
        size: headerSize,
        font: bold ? fontBold : font,
        color: rgb(0.06, 0.09, 0.16),
        maxWidth: contentWidth - labelWidth - 4,
      });
      y -= lineHeight + 2;
      for (let i = 1; i < wrapped.length; i++) {
        if (y < margin + lineHeight) {
          page = doc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(wrapped[i], {
          x: margin,
          y,
          size: headerSize,
          font,
          color: rgb(0.06, 0.09, 0.16),
          maxWidth: contentWidth,
        });
        y -= lineHeight;
      }
    };

    drawLine("Subject: ", msg.subject, true);
    drawLine("From: ", msg.from);
    drawLine("To: ", msg.to);
    drawLine("Date: ", msg.date ? new Date(msg.date).toUTCString() : "—");

    if (msg.attachmentNames.length) {
      drawLine("Attachments: ", msg.attachmentNames.join(", "));
    }

    y -= 8;
    page.drawLine({
      start: { x: margin, y },
      end: { x: pageWidth - margin, y },
      thickness: 1,
      color: rgb(0.89, 0.91, 0.94),
    });
    y -= lineHeight + 4;

    const body = (msg.text || "").trim() || "(No plain-text body)";
    const bodyLines = wrapText(body, maxChars);
    for (const line of bodyLines) {
      if (y < margin + lineHeight) {
        page = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(line || " ", {
        x: margin,
        y,
        size: fontSize,
        font: mono,
        color: rgb(0.15, 0.2, 0.28),
        maxWidth: contentWidth,
      });
      y -= lineHeight;
    }
  }

  return doc.save();
}
