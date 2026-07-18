import type { BusinessProfile, Invoice } from "../model/types";
import { formatMoney } from "./money";

// Markdown invoice (free). Includes YAML frontmatter so payment status and
// totals are queryable / trackable in the vault.
export function renderInvoiceMarkdown(inv: Invoice, business: BusinessProfile): string {
	const lines: string[] = [];
	lines.push("---");
	lines.push(`invoice: "${escapeYaml(inv.number)}"`);
	lines.push(`client: "${escapeYaml(inv.clientName)}"`);
	// Quote the dates so YAML keeps them as strings. Unquoted YYYY-MM-DD parses
	// as a date/timestamp in some readers, and ReminderManager requires a string
	// (typeof fm.due === "string") — unquoted, reminders would silently never fire.
	lines.push(`issued: "${inv.issueDate}"`);
	lines.push(`due: "${inv.dueDate}"`);
	lines.push(`total: ${inv.total}`);
	lines.push(`currency: "${escapeYaml(inv.currency)}"`);
	lines.push(`status: ${inv.status}`);
	lines.push("tags: [invoice]");
	lines.push("---");
	lines.push("");
	lines.push(`# Invoice ${mdInline(inv.number)}`);
	lines.push("");
	lines.push(`**From:** ${mdInline(business.name) || "Your business"}`);
	if (business.address) lines.push(mdInline(business.address.split("\n").join(" · ")));
	if (business.email) lines.push(mdInline(business.email));
	lines.push("");
	lines.push(`**Bill to:** ${mdInline(inv.clientName)}`);
	if (inv.clientAddress) lines.push(mdInline(inv.clientAddress.split("\n").join(" · ")));
	if (inv.clientEmail) lines.push(mdInline(inv.clientEmail));
	lines.push("");
	lines.push(`**Issue date:** ${inv.issueDate}  |  **Due date:** ${inv.dueDate}`);
	lines.push(`**Period:** ${inv.periodStart} → ${inv.periodEnd}`);
	lines.push("");
	lines.push("| Date | Description | Hours | Rate | Amount |");
	lines.push("| --- | --- | ---: | ---: | ---: |");
	for (const l of inv.lines) {
		lines.push(
			`| ${l.date} | ${escapePipe(l.description)} | ${l.hours} | ${formatMoney(l.rate, inv.currency)} | ${formatMoney(l.amount, inv.currency)} |`
		);
	}
	lines.push("");
	lines.push(`**Subtotal:** ${formatMoney(inv.subtotal, inv.currency)}`);
	if (inv.taxRate > 0) {
		lines.push(`**${mdInline(inv.taxLabel)} (${inv.taxRate}%):** ${formatMoney(inv.taxAmount, inv.currency)}`);
	}
	lines.push(`**Total due:** ${formatMoney(inv.total, inv.currency)}`);
	if (inv.notes) {
		lines.push("");
		lines.push("---");
		lines.push(inv.notes);
	}
	lines.push("");
	return lines.join("\n");
}

// Standalone, printable HTML invoice (Pro). Opened in a new window for Print → Save as PDF.
export function renderInvoiceHtml(inv: Invoice, business: BusinessProfile): string {
	const rows = inv.lines
		.map(
			(l) =>
				`<tr><td>${esc(l.date)}</td><td>${esc(l.description)}</td><td class="num">${l.hours}</td><td class="num">${esc(
					formatMoney(l.rate, inv.currency)
				)}</td><td class="num">${esc(formatMoney(l.amount, inv.currency))}</td></tr>`
		)
		.join("\n");

	const taxRow =
		inv.taxRate > 0
			? `<tr><td class="label">${esc(inv.taxLabel)} (${inv.taxRate}%)</td><td class="num">${esc(
					formatMoney(inv.taxAmount, inv.currency)
			  )}</td></tr>`
			: "";

	const logo = business.logoUrl
		? `<img class="logo" src="${esc(business.logoUrl)}" alt="logo" />`
		: "";

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice ${esc(inv.number)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 48px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
  .logo { max-height: 64px; max-width: 220px; }
  h1 { font-size: 28px; margin: 0 0 4px; }
  .muted { color: #666; }
  .parties { display: flex; justify-content: space-between; gap: 32px; margin-bottom: 24px; }
  .parties h3 { margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: #888; }
  .meta { text-align: right; }
  table.items { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  table.items th { text-align: left; border-bottom: 2px solid #222; padding: 8px 6px; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
  table.items td { padding: 8px 6px; border-bottom: 1px solid #eee; }
  .num { text-align: right; white-space: nowrap; }
  table.totals { margin-left: auto; border-collapse: collapse; min-width: 260px; }
  table.totals td { padding: 6px 8px; }
  table.totals td.label { color: #555; }
  table.totals tr.grand td { font-size: 18px; font-weight: 700; border-top: 2px solid #222; }
  .notes { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; color: #555; white-space: pre-wrap; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="head">
    <div>
      ${logo}
      <h1>Invoice</h1>
      <div class="muted">${esc(inv.number)}</div>
    </div>
    <div class="meta">
      <div><strong>${esc(business.name || "Your business")}</strong></div>
      <div class="muted">${nl2br(business.address)}</div>
      <div class="muted">${esc(business.email)}</div>
    </div>
  </div>

  <div class="parties">
    <div>
      <h3>Bill to</h3>
      <div><strong>${esc(inv.clientName)}</strong></div>
      <div class="muted">${nl2br(inv.clientAddress)}</div>
      <div class="muted">${esc(inv.clientEmail)}</div>
    </div>
    <div class="meta">
      <h3>Details</h3>
      <div>Issue date: ${esc(inv.issueDate)}</div>
      <div>Due date: ${esc(inv.dueDate)}</div>
      <div>Period: ${esc(inv.periodStart)} → ${esc(inv.periodEnd)}</div>
    </div>
  </div>

  <table class="items">
    <thead>
      <tr><th>Date</th><th>Description</th><th class="num">Hours</th><th class="num">Rate</th><th class="num">Amount</th></tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <table class="totals">
    <tr><td class="label">Subtotal</td><td class="num">${esc(formatMoney(inv.subtotal, inv.currency))}</td></tr>
    ${taxRow}
    <tr class="grand"><td>Total due</td><td class="num">${esc(formatMoney(inv.total, inv.currency))}</td></tr>
  </table>

  ${inv.notes ? `<div class="notes">${esc(inv.notes)}</div>` : ""}
</body>
</html>`;
}

function esc(s: string): string {
	return (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function nl2br(s: string): string {
	return esc(s ?? "").replace(/\n/g, "<br/>");
}
// Neutralize a single-line Markdown scalar interpolated into the invoice note:
// collapse newlines (so a pasted multi-line value can't inject new Markdown lines,
// e.g. a stray heading) and defuse wiki links/embeds so a value like
// `![[Private note]]` can't transclude unrelated vault content into the invoice.
function mdInline(s: string): string {
	return (s ?? "").replace(/[\r\n]+/g, " ").replace(/(!?)\[\[/g, "$1\\[\\[");
}

function escapePipe(s: string): string {
	// Escape backslashes first so an authored `\|` can't leave a live column
	// separator that shifts the table's cells, then defuse wiki embeds/links so a
	// description like `![[secret]]` can't transclude vault content into the table.
	return (s ?? "")
		.replace(/\\/g, "\\\\")
		.replace(/\|/g, "\\|")
		.replace(/(!?)\[\[/g, "$1\\[\\[");
}
function escapeYaml(s: string): string {
	// This value is emitted as a YAML double-quoted scalar, where both `\` and `"`
	// are escape characters. Escape backslash first, then the quote, and drop any
	// CR/LF that would prematurely end the scalar and corrupt the whole block —
	// which would silently break Dataview status queries and Pro due-date reminders.
	return (s ?? "")
		.replace(/\\/g, "\\\\")
		.replace(/"/g, '\\"')
		.replace(/[\r\n]+/g, " ");
}
