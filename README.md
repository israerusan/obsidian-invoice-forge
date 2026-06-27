# Invoice Forge

Turn billable hours logged in your notes into client invoices — for [Obsidian](https://obsidian.md).

Log work as you go with a simple `#billable` line, then generate a clean invoice for any
client and date range. Built for freelancers and consultants who already live in their vault.

## How it works

Add a billable line anywhere in your notes (daily notes work great):

```
- #billable #client/acme 09:00-11:30 Implemented auth flow
- #billable #client/acme 2.5h Landing page revisions
- #billable [client:: Beta LLC] [time:: 1h30m] [rate:: 90] [date:: 2026-06-25] Design review
```

Recognized tokens on a `#billable` line:

| Token | Meaning |
| --- | --- |
| `#client/<slug>` or `[client:: Name]` | Which client to bill |
| `09:00-11:30`, `2.5h`, `90m`, `1h30m` | Duration |
| `[rate:: 90]` | Per-entry rate override (optional) |
| `[date:: 2026-06-25]` | Entry date (optional) |

When no date token is present, the entry date falls back to the note's frontmatter `date`,
then a `YYYY-MM-DD` in the filename (daily notes), then the file's modified date.

Run **Create invoice** (ribbon icon or command palette), pick a client and date range, and
Invoice Forge collects every matching entry into a numbered invoice note.

## Free features

- Scan the vault for `#billable` time entries
- Client management (default rate, currency, address, `#client/<slug>` resolution)
- Generate Markdown invoice notes with line items and totals
- Automatic invoice numbering (`INV-{YYYY}-{seq:4}` and custom templates)
- "Preview unbilled hours by client" command
- "Insert billable entry" command

## Pro features

- **PDF / print export** — open a styled, branded invoice and Print → Save as PDF
- **Tax & multi-currency** — VAT/GST/sales tax and per-client currency
- **Billing reminders** — get notified about invoices due soon or overdue
- **Payment tracking** — invoices carry `status: unpaid/paid/overdue` in frontmatter
- **Branding** — your logo and business header on exported invoices

License keys are verified **offline** (Ed25519). No account, server, or subscription.

## Install (manual)

1. Copy `main.js`, `manifest.json`, and `styles.css` into `.obsidian/plugins/invoice-forge/`
2. Enable **Invoice Forge** in Settings → Community plugins
3. Open Settings → Invoice Forge to add your business details and clients

## Activate Pro

1. Purchase Invoice Forge Pro (link in the plugin settings)
2. You will receive a license key by email
3. Open Obsidian → Settings → Invoice Forge
4. Paste your license key — Pro unlocks immediately (offline verification)

## Development

```bash
npm install
npm run build   # production bundle → main.js
npm test        # bundles pure logic and runs unit + license tests
```

### Author tooling

```bash
npm run license:keygen          # one-time: create the signing keypair (already done)
npm run license:generate -- you@example.com   # mint a Pro key for a buyer
```

The private signing key lives in `scripts/.license-private.key` and is gitignored — never
commit or publish it. Only the public key ships, in `src/license/publicKey.ts`.

## Pricing label

Listed as **Optional payments** in the Obsidian Community directory (free core + paid Pro unlock).

## Author

Built for the Obsidian community. Issues and feature requests welcome on GitHub.
