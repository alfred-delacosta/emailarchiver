# EmailArchiver

Upload `.eml` / `.mbox` files (or a zip of those), parse them into a searchable library, multi-select messages, preview, and export to PDF.

**No live inbox or OAuth in v1.** Gmail connection is marked Coming soon.

## Stack

- Next.js App Router + TypeScript
- **CSS Modules + global CSS** (no Tailwind) with Designer's light tokens
- `mailparser` for `.eml`; custom mbox splitter + `mailparser` for `.mbox`
- `pdf-lib` for reliable server-side PDF generation (no Chromium)
- File uploads via API routes; temporary storage under `.data/` (gitignored)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). App UI: [http://localhost:3000/app](http://localhost:3000/app).

```bash
npm run build
npm start
```

## Environment

No required env vars for local v1. Session data is keyed by an `ea_session` cookie and stored on local disk under `.data/`.

| Variable | Default | Notes |
|----------|---------|-------|
| *(none)* | — | Production should use object storage (S3/R2) instead of local `.data/` |

## Limits (v1 defaults)

- **25 MB** max per file
- **50 files** per upload batch
- Accepted: `.eml`, `.mbox`, `.zip` (containing eml/mbox)
- One bad file does not fail the whole batch
- Uploads retained until you wipe via **Settings → Delete data** or `DELETE /api/data`
- Documented: production needs object storage + retention TTL; v1 uses session-scoped local disk

## Privacy

Files stay on this machine / your server. No third-party email APIs in v1. Wipe session uploads anytime from Settings.

## Routes

**Marketing (indexable):** `/`, `/features`, `/security`, `/pricing`, `/faq`

**App (`noindex,nofollow`):** `/app`, `/app/library`, `/app/preview/[id]`, `/app/exports`, `/app/settings`

## API

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/upload` | Accept files, parse, return message metadata |
| GET | `/api/messages` | List messages for session |
| GET | `/api/messages/[id]` | Message detail |
| POST | `/api/export` | Generate PDF(s), return download URLs |
| GET | `/api/export/[id]` | Download generated PDF |
| DELETE | `/api/data` | Wipe session uploads & exports |

## Future

- Gmail source (OAuth) — Coming soon
- Object storage for production retention
- Richer HTML→PDF fidelity options

## License

Private / all rights reserved unless otherwise stated.
