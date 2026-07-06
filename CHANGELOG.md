# Changelog

All notable changes to Invoice Forge are documented here. This project follows
[Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-07-06

### Fixed
- **Duplicate-billing protection is now transactional and crash-consistent.**
  Invoices reserve their number, mark source lines billed (validated + rolled
  back on failure), and create the note last — so a mid-run error can never leave
  work billed-but-re-billable or produce a duplicate invoice number. A recovery
  journal replays an interrupted invoice on next launch (creates the missing note
  and marks any unmarked lines). The "Create invoice" button locks during creation.
- **The drift guard now compares the whole source line**, so any post-preview edit
  to a billable line (client, date, rate, hours, or text) is detected before it
  can be mis-billed.
- **No more wrong totals.** A non-numeric client rate/tax can no longer produce a
  `$NaN` invoice; the modal preview now matches the created invoice to the penny
  (per-line rounding) and shows tax + total for Pro. Negative rates and
  out-of-range tax are rejected with a clear message.
- **No phantom charges.** `#billable` lines inside code blocks and frontmatter are
  ignored, and a date embedded in prose no longer hijacks the entry date.
- **Nothing silently dropped.** `#billable` lines that can't be parsed (e.g. a
  typo'd time or `2h typo`) are surfaced instead of vanishing; invalid time
  ranges/durations and impossible dates (e.g. `2026-02-30`) are rejected rather
  than guessed. Period dates are validated and must be in order.
- Billable entries are found by scanning note content directly, so work added just
  before invoicing is never missed due to a stale metadata cache.
- Editing a client's slug can no longer overwrite a different client.

### Added
- First-run onboarding: a guided settings banner and an "Insert an example line"
  on-ramp in the empty invoice modal, plus a business-name nudge.
- Clear desktop-only messaging for PDF/print export on mobile (free capture,
  scan, and invoice generation still work on mobile).

### Changed
- Fixed the Pro purchase link (it pointed at the wrong product) and made the
  price ($19 one-time) visible in-app and in the README.
- Sharper README positioning, accurate token docs, and a Free-vs-Pro table.

## [1.0.3] - 2026-07-05

### Internal
- **`npm run lint` now runs `eslint-plugin-obsidianmd` — the exact ruleset
  Obsidian's automated community-plugin review uses** — as a hard gate
  (`eslint . --max-warnings 0`), so review failures are caught locally before a
  release instead of after (a failed review delists the plugin). Added a
  **manifest-contract test** and a reusable **release checklist** in `docs/`.

### Fixed
- Type-safety issues surfaced by the new lint gate (no behavior change): the
  invoice modal's open handler no longer returns a floating promise, redundant
  frontmatter type assertions were removed, and reminder labels render only
  string/number frontmatter (never `[object Object]`).

## [1.0.2] - 2026-07-05

### Fixed
- Invoice issue/due dates are quoted in frontmatter so they stay strings — this
  makes billing reminders fire reliably (unquoted dates could be parsed as
  timestamps and skipped).

## [1.0.1] - 2026-06-26

### Fixed
- PDF / print export now opens the invoice safely via a Blob URL instead of
  `document.write`.

## [1.0.0] - 2026-06-26

### Added
- Initial release: scan notes for `#billable` time entries, manage clients, and
  generate numbered Markdown invoices with duplicate-billing protection. Pro adds
  branded PDF/print export, tax & multi-currency, and due-date reminders.
