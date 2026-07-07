# Invoice Forge

> You already wrote down the work. Invoice Forge finds `#billable` entries across your [Obsidian](https://obsidian.md) notes, builds the invoice, and marks each item billed so nothing is missed or charged twice.

Find the billable work hidden in your daily notes and turn it into a client invoice — without re-entering it in another app. Built for the solo consultant or freelancer who bills hourly and already lives in their vault.

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
| `09:00-11:30`, `2.5h`, `90m`, `1h30m` | Duration, as a time range or an `h`/`m` value on the line |
| `[time:: 1h30m]`, `[hours:: 2]`, `[duration:: 90m]` | Duration as an inline field (a bare number is only read here, not loose on the line) |
| `[rate:: 90]` | Per-entry rate override (optional) |
| `[date:: 2026-06-25]` | Entry date (optional) |

When no date token is present, the entry date falls back to the note's frontmatter `date`,
then a `YYYY-MM-DD` in the filename (daily notes), then the file's modified date.

Run **Create invoice** (ribbon icon or command palette), pick a client and date range, and
Invoice Forge collects every matching entry into a numbered invoice note.

After creation, each source line receives a portable `[invoice:: INV-…]` marker. Invoiced
work is excluded from later scans, so it **cannot be billed twice**. Lines inside fenced code
blocks and YAML frontmatter are ignored, so example `#billable` lines in your notes are never
billed — and any `#billable` line Invoice Forge can't parse (e.g. a typo'd time) is surfaced,
not silently dropped, so tagged work never disappears from an invoice.

## Free vs Pro

**Pro is $15, one-time — no subscription.** One recovered forgotten hour usually pays for it. The full capture → invoice → billed workflow is free.

| Area | Free | Pro |
| --- | :--: | :--: |
| Scan notes for `#billable`, preview unbilled hours by client | Yes | Yes |
| Client management (rate, currency, address, `#client/<slug>`) | Yes | Yes |
| Numbered Markdown invoices with line items & totals | Yes | Yes |
| Payment-status frontmatter (`unpaid/paid/overdue`, Dataview-queryable) | Yes | Yes |
| Source-note billing markers (can't be billed twice) | Yes | Yes |
| PDF / print export with your logo & business header | No | Yes |
| Tax (VAT/GST/sales) & per-client currency | No | Yes |
| Due-date reminders for unpaid / overdue invoices | No | Yes |

License keys are verified **offline** (Ed25519) — no account, server, or subscription.

## Privacy & platform

Invoice Forge is local-first: it reads and writes notes in your vault and **never phones home** — no account, no network calls, no telemetry. Your rates, clients, and invoices stay in your vault.

Capture, scan, and invoice generation work on **desktop and mobile**. PDF export is a desktop step (it opens a printable invoice for Print → Save as PDF).

## Install (manual)

1. Copy `main.js`, `manifest.json`, and `styles.css` into `.obsidian/plugins/invoice-forge/`
2. Enable **Invoice Forge** in Settings → Community plugins
3. Open Settings → Invoice Forge to add your business details and clients

## Activate Pro

1. Purchase Invoice Forge Pro ($15 one-time) — the buy link is in the plugin's settings tab under **License key**, or on [Buy Me a Coffee](https://buymeacoffee.com/vaultspotlight/e/554726)
2. You will receive a license key by email
3. Open Obsidian → Settings → Invoice Forge
4. Paste your license key — Pro unlocks immediately (offline verification)

## Development

```bash
npm install
npm run build   # production bundle → main.js
npm test        # typecheck + lint + unit & license tests
```

Maintainer/license-tooling notes live in [`docs/maintaining.md`](docs/maintaining.md).

## Support & guarantee

Questions, bugs, or feature requests are welcome on the GitHub issue tracker. Not the right fit for your workflow? Email within 14 days of purchase for a refund.

Listed as **Optional payments** in the Obsidian Community directory (free core + paid Pro unlock). Built for the Obsidian community.
