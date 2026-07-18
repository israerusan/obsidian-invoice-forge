# Changelog

All notable changes to Invoice Forge are documented here. This project follows
[Semantic Versioning](https://semver.org/).

## [1.2.1] - 2026-07-18

Second hardening pass from a multi-agent adversarial review. Happy-path billing is
unchanged; these fix correctness and robustness edge cases and tighten data safety.

### Fixed
- **Exact time billing.** Durations are no longer pre-rounded to 1/100 h before the
  money math. Previously a bare `1m` rounded up to 0.02 h (a 20% overbill) and
  `1h1m` billed as 1.02 h; entries now bill the exact worked time (money is still
  rounded to each currency's scale, hours shown to two decimals).
- **Crash recovery can't double-bill.** Recovery now validates every journaled
  source line *before* writing anything. If a line drifted while unmarked, it
  writes nothing and asks you to reconcile — instead of creating the invoice, then
  leaving that work unmarked and re-billable on the next scan. Recovery also writes
  one edit per note rather than one per entry.
- **Targeted rollback.** Undoing a failed invoice now removes markers only from the
  exact lines it billed, so a reused/duplicate invoice number can't strip markers
  from unrelated, already-billed work elsewhere in a note.
- **Client-tag matching.** Client slugs are generated Unicode-aware, so a client
  named "Café" (`#client/café`) is no longer saved as `caf` and silently unmatched.
  Nested `#client/<slug>/<sub>` tags resolve to the first segment and no longer
  leak `/sub` into the invoice description.
- **Stricter input.** An explicit but unparseable `[time::]`/`[hours::]` field is
  surfaced as a skipped line instead of silently borrowing a number from the
  description prose. Note dates from frontmatter/filenames must be real calendar
  dates (an impossible `2026-02-30` falls through instead of mis-periodising work).
- **License validation.** A signed license is accepted only when its payload is a
  well-formed object with a non-empty email and issue date (existing keys are
  unaffected).
- **Reminders.** The invoice-folder and `status` matches are case-insensitive
  (so "Invoices"/"invoices" and "Paid"/"paid" behave), an unquoted frontmatter
  `due:` date (a `Date` object) is handled, and only real ISO dates are compared.
- **Windows-safe files & templates.** Line endings are preserved when marking
  billed lines (CRLF notes stay CRLF), reserved filenames (`CON`, `NUL`, …) and
  trailing dots/spaces are handled, and `{seq:N}` padding is capped so a mistyped
  template can't freeze rendering.
- **Data safety.** More persisted settings (license key, folder, template,
  toggles) are type-coerced on load, so a corrupt or hand-edited `data.json` can't
  crash startup. The invoice modal shows a retryable error instead of a stuck
  "Scanning…" spinner if a vault read fails.
- **Invoice rendering.** Single-line fields (names, emails, tax label, number) have
  their newlines collapsed and wiki-embeds defused, so a pasted value can't
  restructure the invoice note or transclude unrelated vault content.

## [1.2.0] - 2026-07-06

Hardening release from a multi-round adversarial code review. No changes to the
normal happy-path workflow; these fix edge cases that could mis-bill, crash, or
silently drop work.

### Fixed
- **Billing integrity.** Crash-recovery now runs under the same lock as invoice
  creation, so a replay and a user-triggered create can never both bill the same
  entries; a failed marking step clears its journal so a fully-drifted batch can't
  be resurrected as a phantom invoice; and a corrupt recovery journal can no
  longer loop on every launch.
- **Money & currency.** Invoice arithmetic rounds to each currency's own scale, so
  zero-decimal currencies (JPY, KRW, …) no longer show line items that don't add
  up to the total, and per-line rates round consistently with the amounts.
- **Cross-client safety.** Two clients that share a display name but use different
  `#client/<slug>` tags can no longer be billed onto each other.
- **Parser.** `#billable-later`/`#billableish` are no longer treated as billable
  (nested `#billable/<child>` still is); accented `#client/<slug>` tags are read
  in full; a line with two clock ranges is surfaced instead of undercounted; a
  negative or thousands-separated inline rate is handled correctly; and any
  `[invoice:: …]` marker (even empty) blocks re-billing.
- **Dates.** A just-saved note's frontmatter `date:` is read from fresh content,
  so it isn't mis-dated to the file's modified time and dropped from its period.
- **Resilience.** A corrupt or hand-edited `data.json` (non-string business
  fields, a string `nextSeq`, etc.) is coerced on load instead of crashing the
  settings tab or corrupting invoice numbering.
- **Invoice notes.** Frontmatter and line-item cells escape backslashes/quotes, so
  unusual client names or descriptions can't corrupt the YAML (which powers
  Dataview status and reminders) or the line-item table.
- **Settings.** The license-key field can be typed by hand without losing focus,
  and the reminder scan uses the same normalized invoice folder as creation.

## [1.1.1] - 2026-07-06

### Changed
- Pro is now **$15 one-time** (down from $19), quoted consistently across the
  settings upsell, invoice modal, and README.
- Updated the funding/purchase link to the canonical Buy Me a Coffee URL.

### Fixed
- Corrected the TypeScript `lib`/`target` (to `ES2020`/`ES2018`) so standard
  string methods (`padStart`, `trimStart`, `trimEnd`) are properly typed. This
  clears a batch of spurious `no-unsafe-*` lint warnings in the Obsidian review
  ruleset — no runtime behavior changes.
- Removed leftover placeholder/TODO text from the README.

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
